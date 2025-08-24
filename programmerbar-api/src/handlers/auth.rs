use crate::{
    config::Config, errors::ApiError, extractors::auth::AuthorizedMember,
    services::session::SessionService, state::AppState,
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
use utoipa_axum::{router::OpenApiRouter, routes};

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::new()
        .routes(routes!(feide_auth))
        .routes(routes!(feide_callback))
        .routes(routes!(logout))
}

fn determine_redirect_url(jar: &CookieJar, config: &Config) -> String {
    if let Some(app_cookie) = jar.get("app") {
        match app_cookie.value() {
            "web" => config.web_redirect_url.clone().unwrap_or("/".to_string()),
            _ => "/".to_string(),
        }
    } else {
        "/".to_string()
    }
}

#[derive(Deserialize)]
pub struct AuthParams {
    app: Option<String>,
}

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
async fn feide_auth(
    State(state): State<AppState>,
    Query(params): Query<AuthParams>,
    jar: CookieJar,
) -> Result<impl IntoResponse, ApiError> {
    let csrf_state = CsrfToken::new_random();

    // Generate authorization URL with CSRF state
    let auth_url = state
        .feide_provider
        .authorization_url_with_state(&csrf_state)
        .map_err(|_| ApiError::InternalServerError)?;

    // Store CSRF state in a regular cookie (not encrypted)
    let state_cookie = Cookie::build(("feide_oauth_state", csrf_state.into_secret()))
        .max_age(Duration::seconds(600))
        .http_only(true)
        .secure(!state.config.is_dev);

    let app_cookie_value = params.app.unwrap_or("api".to_string());
    let app_cookie = Cookie::build(("app", app_cookie_value))
        .max_age(Duration::seconds(600))
        .http_only(true)
        .secure(!state.config.is_dev);

    // Add cookies to the jar
    let jar = jar.add(state_cookie).add(app_cookie);

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
async fn feide_callback(
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
    let existing_user = state.user_service.get_by_feide_id(&feide_user.sub).await?;

    if let Some(user) = existing_user {
        // User exists
        // Create session and redirect based on app parameter
        let session = state.session_service.create_session(user.id).await?;

        let session_cookie = state.session_service.create_session_cookie(&session.id);
        let updated_jar = private_jar.add(session_cookie);

        // Determine redirect URL based on app parameter
        let redirect_url = determine_redirect_url(&regular_jar, &state.config);
        return Ok((updated_jar, Redirect::to(&redirect_url)));
    }

    // Check for valid invitation
    let invitation = state
        .invitation_service
        .get_by_email(&feide_user.email)
        .await?;

    let invitation = invitation.ok_or(ApiError::BadRequest(
        "No valid invitation found for this email".to_string(),
    ))?;

    // Create new user
    let user_id = uuid::Uuid::new_v4().to_string();
    let new_user = crate::models::user::User::create(
        user_id.clone(),
        feide_user.name,
        feide_user.email,
        feide_user.sub,
    );

    // Insert the new user
    state.user_service.create(&new_user).await?;

    // Mark invitation as used
    state.invitation_service.claim(&invitation.id).await?;

    // Create session for new user
    let session = state.session_service.create_session(user_id).await?;

    let session_cookie = state.session_service.create_session_cookie(&session.id);
    let updated_jar = private_jar.add(session_cookie);

    // Determine redirect URL based on app parameter
    let redirect_url = determine_redirect_url(&regular_jar, &state.config);
    Ok((updated_jar, Redirect::to(&redirect_url)))
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
async fn logout(
    State(state): State<AppState>,
    jar: PrivateCookieJar,
    auth: AuthorizedMember,
) -> Result<impl IntoResponse, ApiError> {
    // Delete session from database
    state
        .session_service
        .delete_session(&auth.session.id)
        .await?;

    // Create logout cookie (expires immediately)
    let logout_cookie = SessionService::create_logout_cookie();
    let updated_jar = jar.add(logout_cookie);

    Ok((updated_jar, StatusCode::OK))
}
