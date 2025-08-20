use axum::{
    extract::FromRequestParts,
    http::{StatusCode, request::Parts},
};

use crate::state::AppState;

pub struct User;

impl FromRequestParts<AppState> for User {
    type Rejection = StatusCode;

    async fn from_request_parts(
        parts: &mut Parts,
        _state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        if let Some(auth) = parts.headers.get("authorization") {
            if auth == "Bearer secret-token" {
                return Ok(User);
            }
        }
        Err(StatusCode::UNAUTHORIZED)
    }
}

pub struct BoardUser;

impl FromRequestParts<AppState> for BoardUser {
    type Rejection = StatusCode;

    async fn from_request_parts(
        parts: &mut Parts,
        _state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        if let Some(auth) = parts.headers.get("authorization") {
            if auth == "Bearer secret-token" {
                return Ok(BoardUser);
            }
        }
        Err(StatusCode::UNAUTHORIZED)
    }
}
