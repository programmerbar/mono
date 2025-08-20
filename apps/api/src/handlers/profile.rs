use crate::{dto::user::ProfileResponse, errors::ApiError, models::auth::AuthorizedMember};
use axum::Json;

pub async fn get_profile(auth: AuthorizedMember) -> Result<Json<ProfileResponse>, ApiError> {
    Ok(Json(ProfileResponse::from(auth.user)))
}
