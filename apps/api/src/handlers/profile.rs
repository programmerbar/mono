use crate::{dto::ProfileResponse, errors::ApiError, models::auth::AuthorizedMember};
use axum::Json;

/// Get profile information of the authenticated user.
#[utoipa::path(
    get,
    path = "/profile",
    responses(
        (status = 200, description = "User profile", body = ProfileResponse),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Profile"
)]
pub async fn get_profile(auth: AuthorizedMember) -> Result<Json<ProfileResponse>, ApiError> {
    Ok(Json(ProfileResponse::from(auth.user)))
}
