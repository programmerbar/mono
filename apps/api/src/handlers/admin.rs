use std::collections::HashMap;

use axum::{
    Json,
    extract::{Path, State},
};

use crate::{dto, errors::ApiError, extractors::admin::AdminKey, state::AppState};

/// Test endpoint to verify it checks the admin key
#[utoipa::path(
    get,
    path = "/admin",
    responses(
        (status = 200, body = dto::RootResponse<HashMap<String, String>>)
    ),
    security(
        ("admin_key" = [])
    ),
    tag = "Admin"
)]
pub async fn admin_test(_admin_key: AdminKey) -> Json<dto::RootResponse<HashMap<String, String>>> {
    let mut info = HashMap::new();
    info.insert("you are".to_string(), "admin".to_string());

    Json(dto::RootResponse {
        success: true,
        data: Some(info),
    })
}

/// Get user info
#[utoipa::path(
    get,
    path = "/admin/user/{user_id}",
    responses(
        (status = 200, body = dto::RootResponse<dto::UserResponse>),
        (status = 404, description = "User not found"),
        (status = 403, description = "Forbidden")
    ),
    security(
        ("admin_key" = [])
    ),
    tag = "Admin"
)]
pub async fn admin_get_user(
    State(state): State<AppState>,
    Path(user_id): Path<String>,
    _admin_key: AdminKey,
) -> Result<Json<dto::RootResponse<dto::UserResponse>>, ApiError> {
    let user = state
        .user_service
        .find_active_by_id(&user_id)
        .await
        .map_err(|_| ApiError::NotFound(format!("Failed to find a user with the id {user_id}")))?;

    Ok(Json(dto::RootResponse {
        success: true,
        data: Some(dto::UserResponse::from(user)),
    }))
}
