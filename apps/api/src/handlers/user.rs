use crate::errors::ApiError;
use axum::{Json, extract::State, response::IntoResponse};

use crate::{dto::User, state::AppState};

/// List all users, by default it only lists the active users.
#[utoipa::path(
    get,
    path = "/users",
    responses(
        (status = 200, description = "A list of users", body = Vec<User>),
        (status = 500, description = "Internal server error")
    ),
    tag = "Users"
)]
pub async fn list_users(State(state): State<AppState>) -> Result<impl IntoResponse, ApiError> {
    let users = state.user_service.list_active().await?;
    Ok(Json(users))
}
