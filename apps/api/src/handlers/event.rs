use axum::{Json, extract::State};

use crate::{
    dto::EventWithShifts, errors::ApiError, models::auth::AuthorizedMember, state::AppState,
};

/// Get all events with their associated volunteer shifts.
/// 
/// Returns a comprehensive list of all events in the system, including detailed information
/// about volunteer shifts for each event. This endpoint requires authentication as it contains
/// sensitive volunteer scheduling information.
/// 
/// # Authentication
/// Requires a valid session token to access.
#[utoipa::path(
    get,
    path = "/events",
    responses(
        (status = 200, description = "List of all events with shifts", body = Vec<EventWithShifts>),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Events"
)]
pub async fn all_events(
    State(state): State<AppState>,
    _auth: AuthorizedMember,
) -> Result<Json<Vec<EventWithShifts>>, ApiError> {
    let events = state
        .event_repo
        .all_with_shifts()
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    Ok(Json(events))
}
