use axum::{Json, extract::State};

use crate::{
    dto::event::EventWithShifts, errors::ApiError, models::auth::AuthorizedMember, state::AppState,
};

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
