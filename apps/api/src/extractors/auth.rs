#![allow(dead_code)]

use axum::{extract::FromRequestParts, http::request::Parts};

use crate::{
    errors::ApiError,
    extractors::utils::extract_session_cookie,
    models::{session::Session, user::User},
    state::AppState,
};

/// Represents an authorized member with a valid session and user information.
pub struct AuthorizedMember {
    pub session: Session,
    pub user: User,
}

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

/// Extractor for an authorized board member.
pub struct AuthorizedBoardMember {
    pub session: Session,
    pub user: User,
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

/// Extractor for either an authorized member or board member.
/// Useful for endpoints that can be accessed by an admin or a regular member.
pub enum AuthorizedMemberOrBoardMember {
    Member(AuthorizedMember),
    BoardMember(AuthorizedBoardMember),
}

impl FromRequestParts<AppState> for AuthorizedMemberOrBoardMember {
    type Rejection = ApiError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let session_id = extract_session_cookie(parts, state.key.clone())?;
        let (session, user) = state.auth_service.validate_session(&session_id).await?;

        if user.is_board_member() {
            Ok(AuthorizedMemberOrBoardMember::BoardMember(
                AuthorizedBoardMember { session, user },
            ))
        } else {
            Ok(AuthorizedMemberOrBoardMember::Member(AuthorizedMember {
                session,
                user,
            }))
        }
    }
}
