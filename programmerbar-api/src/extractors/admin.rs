use axum::{extract::FromRequestParts, http::request::Parts};

use crate::{errors::ApiError, extractors::utils::get_bearer_token, state::AppState};

pub struct AdminKey;

impl FromRequestParts<AppState> for AdminKey {
    type Rejection = ApiError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let bearer_token = get_bearer_token(parts).ok_or(ApiError::Unauthorized)?;
        if bearer_token != state.config.admin_key {
            return Err(ApiError::Unauthorized);
        }
        Ok(AdminKey)
    }
}
