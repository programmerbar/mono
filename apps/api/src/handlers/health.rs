use axum::Json;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema)]
pub struct HealthResponse {
    pub status: String,
    pub message: String,
}

/// Check the health status of the API.
///
/// Returns a simple health check response indicating that the API is running.
/// This endpoint is typically used by monitoring systems and load balancers.
#[utoipa::path(
    get,
    path = "/health",
    responses(
        (status = 200, description = "API health status", body = HealthResponse)
    ),
    tag = "Health"
)]
pub async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        message: "Programmerbar API is running".to_string(),
    })
}
