use crate::{
    errors::ApiError, models::auth::AuthorizedMember, services::session::SessionService,
    state::AppState,
};
use axum::{
    extract::{Query, State},
    response::{IntoResponse, Redirect},
};
use axum_extra::extract::{CookieJar, PrivateCookieJar, cookie::Cookie};
use cookie::time::Duration;
use oauth2::CsrfToken;
use reqwest::StatusCode;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct CallbackParams {
    code: String,
    state: String,
}

/// Initiate OAuth authentication with Feide.
///
/// Redirects the user to Feide (Norwegian education federation) for authentication.
/// This is the first step in the OAuth flow. After successful authentication,
/// the user will be redirected back to the callback endpoint.
///
/// Sets a secure state cookie to prevent CSRF attacks during the OAuth flow.
#[utoipa::path(
    get,
    path = "/auth/feide",
    responses(
        (status = 302, description = "Redirect to Feide OAuth"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Authentication"
)]
pub async fn feide_auth(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<(CookieJar, Redirect), ApiError> {
    let csrf_state = CsrfToken::new_random();

    // Generate authorization URL with CSRF state
    let auth_url = state
        .feide_provider
        .authorization_url_with_state(&csrf_state)
        .map_err(|_| ApiError::InternalServerError)?;

    // Store CSRF state in a regular cookie (not encrypted)
    let c = Cookie::build(("feide_oauth_state", csrf_state.into_secret()))
        .max_age(Duration::seconds(600))
        .http_only(true)
        .secure(!state.config.is_dev);
    let jar = jar.add(c);

    Ok((jar, Redirect::to(&auth_url)))
}

/// Handle OAuth callback from Feide authentication.
///
/// This endpoint receives the authorization code from Feide after successful authentication.
/// It validates the state parameter, exchanges the code for tokens, retrieves user information,
/// and either creates a new user account (if invited) or logs in an existing user.
///
/// # Parameters
/// * `code` - Authorization code from Feide OAuth
/// * `state` - State parameter for CSRF protection
///
/// # User Creation
/// New users can only be created if they have a valid invitation in the system.
/// The invitation is matched by email address and deleted after successful account creation.
#[utoipa::path(
    get,
    path = "/auth/feide/callback",
    params(
        ("code" = String, Query, description = "OAuth authorization code"),
        ("state" = String, Query, description = "OAuth state parameter")
    ),
    responses(
        (status = 302, description = "Redirect after successful authentication"),
        (status = 400, description = "Invalid state or missing invitation"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Authentication"
)]
pub async fn feide_callback(
    State(state): State<AppState>,
    Query(params): Query<CallbackParams>,
    regular_jar: CookieJar,
    private_jar: PrivateCookieJar,
) -> Result<impl IntoResponse, ApiError> {
    // Validate state parameter
    let feide_oauth_state = regular_jar
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
        let updated_jar = private_jar.add(session_cookie);

        return Ok((updated_jar, Redirect::to("/")));
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
    let updated_jar = private_jar.add(session_cookie);

    Ok((updated_jar, Redirect::to("/")))
}

/// Log out the authenticated user.
///
/// Terminates the user's current session by deleting it from the database
/// and clearing the session cookie. After logout, the user will need to
/// authenticate again to access protected endpoints.
///
/// # Authentication
/// Requires a valid session token.
#[utoipa::path(
    post,
    path = "/auth/logout",
    responses(
        (status = 200, description = "Successfully logged out"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Authentication"
)]
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
