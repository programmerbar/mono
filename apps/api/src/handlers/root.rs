use std::collections::HashMap;

use axum::Json;

use crate::dto;

/// Get basic API information.
///
/// Returns fundamental information about the Programmerbar API including
/// its name and version. This endpoint serves as a simple way to verify
/// that the API is running and accessible.
///
/// This endpoint is public and does not require authentication.
#[utoipa::path(
    get,
    path = "/",
    responses(
        (status = 200, description = "API information", body = dto::RootResponse<HashMap<String, String>>)
    ),
    tag = "General"
)]
pub async fn root() -> Json<dto::RootResponse<HashMap<String, String>>> {
    let mut info = HashMap::new();
    info.insert("name".to_string(), "Programmerbar API".to_string());
    info.insert("version".to_string(), "0.1.0".to_string());

    Json(dto::RootResponse {
        success: true,
        data: Some(info),
    })
}
