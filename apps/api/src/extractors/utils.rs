use axum::http::request::Parts;
use axum_extra::extract::PrivateCookieJar;
use cookie::Key;

use crate::errors::ApiError;
use crate::services::session::SESSION_COOKIE_NAME;

pub fn extract_session_cookie(parts: &Parts, key: Key) -> Result<String, ApiError> {
    PrivateCookieJar::from_headers(&parts.headers, key)
        .get(SESSION_COOKIE_NAME)
        .map(|cookie| cookie.value().to_string())
        .ok_or(ApiError::Unauthorized)
}

pub fn get_bearer_token(parts: &Parts) -> Option<String> {
    let auth_header = parts
        .headers
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|value| value.to_str().ok())?;

    auth_header.strip_prefix("Bearer ").map(|t| t.to_string())
}
