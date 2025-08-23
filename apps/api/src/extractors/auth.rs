use axum::{extract::FromRequestParts, http::request::Parts};

use crate::{
    errors::ApiError,
    extractors::utils::extract_session_cookie,
    models::auth::{AuthorizedBoardMember, AuthorizedMember},
    state::AppState,
};

impl FromRequestParts<AppState> for AuthorizedMember {
    type Rejection = ApiError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let session_id = extract_session_cookie(parts, state.key.clone())?;
        let (session, user) = state.auth_service.validate_session(&session_id).await?;

        Ok(AuthorizedMember { session, user })
    }
}

impl FromRequestParts<AppState> for AuthorizedBoardMember {
    type Rejection = ApiError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let session_id = extract_session_cookie(parts, state.key.clone())?;
        let (session, user) = state.auth_service.validate_session(&session_id).await?;

        if !user.is_board_member() {
            return Err(ApiError::Forbidden);
        }

        Ok(AuthorizedBoardMember { session, user })
    }
}
