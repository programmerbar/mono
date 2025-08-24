use std::collections::HashMap;

use axum::Json;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::{dto, extractors::admin::AdminKey, state::AppState};

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::new().routes(routes!(admin_test))
}

/// Test endpoint to verify it checks the admin key
#[utoipa::path(
    get,
    path = "/admin",
    responses(
        (status = 200, body = dto::GenericResponse<HashMap<String, String>>)
    ),
    security(
        ("admin_key" = [])
    ),
    tag = "Admin"
)]
async fn admin_test(_admin_key: AdminKey) -> Json<dto::GenericResponse<HashMap<String, String>>> {
    let mut info = HashMap::new();
    info.insert("you are".to_string(), "admin".to_string());

    Json(dto::GenericResponse {
        success: true,
        data: Some(info),
    })
}
