use std::collections::HashMap;

use axum::Json;

use crate::{dto, extractors::admin::AdminKey};

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
pub async fn test_admin(_admin_key: AdminKey) -> Json<dto::RootResponse<HashMap<String, String>>> {
    let mut info = HashMap::new();
    info.insert("you are".to_string(), "admin".to_string());

    Json(dto::RootResponse {
        success: true,
        data: Some(info),
    })
}
