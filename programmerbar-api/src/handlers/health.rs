use axum::Json;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::{dto::HealthResponse, state::AppState};

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::new().routes(routes!(health))
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
async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        message: "Programmerbar API is running".to_string(),
    })
}
