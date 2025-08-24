use axum::{Json, extract::State, response::IntoResponse};
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::{
    dto::{CreateEventResponse, EventWithShifts, NewEventWithShiftsInput},
    errors::ApiError,
    extractors::auth::AuthorizedMember,
    state::AppState,
};

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::new().routes(routes!(all_events, create_event))
}

/// Get all events with their associated volunteer shifts.
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
async fn all_events(
    State(state): State<AppState>,
    _auth: AuthorizedMember,
) -> Result<impl IntoResponse, ApiError> {
    let events = state
        .event_service
        .all_with_shifts()
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    Ok(Json(events))
}

/// Create a new event with associated volunteer shifts.
///
/// # Authentication
/// Requires a valid session token to access.
#[utoipa::path(
    post,
    path = "/events",
    request_body = NewEventWithShiftsInput,
    responses(
        (status = 201, description = "Event created successfully", body = CreateEventResponse),
        (status = 400, description = "Bad request"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Events"
)]
async fn create_event(
    State(state): State<AppState>,
    _auth: AuthorizedMember,
    Json(input): Json<NewEventWithShiftsInput>,
) -> Result<impl IntoResponse, ApiError> {
    let event_id = state
        .event_service
        .create_with_shifts(input)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    // TODO: Send notification to vounteers about the new event

    Ok(Json(CreateEventResponse { id: event_id }))
}
