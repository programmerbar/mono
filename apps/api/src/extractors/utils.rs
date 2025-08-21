use axum::http::{header::COOKIE, request::Parts};

use crate::{errors::ApiError, extractors::SESSION_COOKIE_NAME};

pub fn extract_session_cookie(parts: &Parts) -> Result<String, ApiError> {
    let cookies = parts
        .headers
        .get(COOKIE)
        .and_then(|value| value.to_str().ok())
        .ok_or(ApiError::Unauthorized)?;

    for cookie in cookies.split(';') {
        let cookie = cookie.trim();
        if let Some(session_id) = cookie.strip_prefix(format!("{SESSION_COOKIE_NAME}=").as_str()) {
            return Ok(session_id.to_string());
        }
    }

    Err(ApiError::Unauthorized)
}

pub fn get_bearer_token(parts: &Parts) -> Option<String> {
    let auth_header = parts
        .headers
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|value| value.to_str().ok())?;

    auth_header.strip_prefix("Bearer ").map(|t| t.to_string())
}
