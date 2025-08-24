use axum::{Json, extract::State};
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::{dto, errors::ApiError, state::AppState};

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::new().routes(routes!(get_status, set_status))
}

/// Get the current status of the bar to see if it is open or closed.
#[utoipa::path(
    get,
    path = "/status",
    responses(
        (status = 200, description = "API status", body = dto::StatusResponse),
        (status = 500, description = "Internal server error")
    ),
    tag = "Status"
)]
async fn get_status(State(state): State<AppState>) -> Result<Json<dto::StatusResponse>, ApiError> {
    let status = state
        .status_service
        .get_status()
        .map_err(|_| ApiError::InternalServerError)?;

    Ok(Json(dto::StatusResponse {
        status: status.value(),
        message: status.description().to_owned(),
    }))
}

/// Set the status of the bar to open, closed or private.
#[utoipa::path(
    post,
    path = "/status",
    request_body(content = dto::StatusRequest, description = "New status for the bar"),
    responses(
        (status = 200, description = "Status updated successfully", body = dto::StatusResponse),
        (status = 400, description = "Invalid status value"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Status"
)]
async fn set_status(
    State(state): State<AppState>,
    Json(request): Json<dto::StatusRequest>,
) -> Result<Json<dto::StatusResponse>, ApiError> {
    let new_status = request
        .status
        .try_into()
        .map_err(|_| ApiError::BadRequest("Invalid status value".to_string()))?;

    state
        .status_service
        .set_status(new_status)
        .map_err(|_| ApiError::InternalServerError)?;

    Ok(Json(dto::StatusResponse {
        status: new_status.value(),
        message: new_status.description().to_owned(),
    }))
}
