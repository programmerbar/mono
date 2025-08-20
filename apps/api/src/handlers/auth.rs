use crate::{
    errors::ApiError, models::auth::AuthorizedMember, services::session::SessionService,
    state::AppState,
};
use axum::{
    extract::{Query, State},
    response::{IntoResponse, Redirect},
};
use axum_extra::extract::{PrivateCookieJar, cookie::Cookie};
use cookie::time::Duration;
use oauth2::CsrfToken;
use reqwest::StatusCode;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct CallbackParams {
    code: String,
    state: String,
}

pub async fn feide_auth(
    State(state): State<AppState>,
    jar: PrivateCookieJar,
) -> Result<(PrivateCookieJar, Redirect), ApiError> {
    let csrf_state = CsrfToken::new_random();

    // Generate authorization URL with CSRF state
    let auth_url = state
        .feide_provider
        .authorization_url_with_state(&csrf_state)
        .map_err(|_| ApiError::InternalServerError)?;

    // Store CSRF state in a cookie
    let c = Cookie::build(("feide_oauth_state", csrf_state.into_secret()))
        .max_age(Duration::seconds(600));
    let jar = jar.add(c);

    Ok((jar, Redirect::to(&auth_url)))
}

pub async fn feide_callback(
    State(state): State<AppState>,
    Query(params): Query<CallbackParams>,
    jar: PrivateCookieJar,
) -> Result<impl IntoResponse, ApiError> {
    // Validate state parameter
    let feide_oauth_state = jar
        .get("feide_oauth_state")
        .ok_or(ApiError::BadRequest("Invalid state".to_string()))?;

    let stored_state = feide_oauth_state.value();
    if stored_state != params.state {
        return Err(ApiError::BadRequest("Invalid state".to_string()));
    }

    // Exchange code for tokens
    let token_response = state
        .feide_provider
        .exchange_code(&params.code)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    // Get user information from Feide
    let feide_user = state
        .feide_provider
        .get_user_info(&token_response.access_token)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    // Check if user exists by Feide ID
    let existing_user = state
        .user_repo
        .get_by_feide_id(&feide_user.sub)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    if let Some(user) = existing_user {
        // User exists
        // Create session and redirect to portal
        let session = state
            .session_service
            .create_session(user.id)
            .await
            .map_err(|_| ApiError::InternalServerError)?;

        let session_cookie = state.session_service.create_session_cookie(&session.id);
        let updated_jar = jar.add(session_cookie);

        return Ok((updated_jar, Redirect::to("/")).into());
    }

    // Check for valid invitation
    let invitation = state
        .invitation_repo
        .get_by_email(&feide_user.email)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    let invitation = invitation.ok_or(ApiError::BadRequest(
        "No valid invitation found for this email".to_string(),
    ))?;

    // Create new user
    let user_id = uuid::Uuid::new_v4().to_string();
    let new_user = crate::models::user::User {
        id: user_id.clone(),
        name: feide_user.name,
        email: feide_user.email,
        feide_id: Some(feide_user.sub),
        role: "normal".to_string(),
        additional_beers: 0,
        alt_email: None,
        is_deleted: false,
    };

    state
        .user_repo
        .create(&new_user)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    // Mark invitation as used
    state
        .invitation_repo
        .delete(&invitation.id)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    // Create session for new user
    let session = state
        .session_service
        .create_session(user_id)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    let session_cookie = state.session_service.create_session_cookie(&session.id);
    let updated_jar = jar.add(session_cookie);

    Ok((updated_jar, Redirect::to("/")))
}

pub async fn logout(
    State(state): State<AppState>,
    jar: PrivateCookieJar,
    auth: AuthorizedMember,
) -> Result<(PrivateCookieJar, StatusCode), ApiError> {
    // Delete session from database
    state
        .session_service
        .delete_session(&auth.session.id)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    // Create logout cookie (expires immediately)
    let logout_cookie = SessionService::create_logout_cookie();
    let updated_jar = jar.add(logout_cookie);

    Ok((updated_jar, StatusCode::OK))
}
