use axum::{
    extract::{Json, State},
    response::IntoResponse,
};
use reqwest::StatusCode;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::{
    dto::NewInvitationInput, errors::ApiError, extractors::auth::AuthorizedMember,
    models::invitation::Invitation, state::AppState,
};

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::new()
        .routes(routes!(send_invitation, list_invitations,))
        .routes(routes!(delete_invitation))
}

/// Send an invitation to a email to join the platform
///
/// # Authentication
/// This endpoint requires authentication via a session token.
#[utoipa::path(
    post,
    path = "/invitations",
    request_body = NewInvitationInput,
    responses(
        (status = 200, description = "Invitation sent successfully"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Invitations"
)]
async fn send_invitation(
    State(state): State<AppState>,
    _auth: AuthorizedMember,
    Json(input): Json<NewInvitationInput>,
) -> Result<impl IntoResponse, ApiError> {
    // Create the invitation
    state
        .invitation_service
        .new_invitation(input.email.as_ref())
        .await?;

    Ok(StatusCode::OK)
}

/// Get all invitations sent
///
/// # Authentication
/// This endpoint requires authentication via a session token.
#[utoipa::path(
    get,
    path = "/invitations",
    responses(
        (status = 200, description = "List of invitations", body = Vec<Invitation>),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Invitations"
)]
async fn list_invitations(
    State(state): State<AppState>,
    _auth: AuthorizedMember,
) -> Result<impl IntoResponse, ApiError> {
    let invitations = state.invitation_service.get_all().await?;

    // TODO: Send invitation on email

    Ok(Json(invitations))
}

/// Delete an invitation by ID
///
/// # Authentication
/// This endpoint requires authentication via a session token.
#[utoipa::path(
    delete,
    path = "/invitations/{id}",
    params(
        ("id" = String, Path, description = "The ID of the invitation to delete")
    ),
    responses(
        (status = 200, description = "Invitation deleted successfully"),
        (status = 401, description = "Unauthorized"),
        (status = 404, description = "Invitation not found"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Invitations"
)]
async fn delete_invitation(
    State(state): State<AppState>,
    _auth: AuthorizedMember,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<impl IntoResponse, ApiError> {
    // Delete the invitation
    state.invitation_service.delete(&id).await?;

    Ok(StatusCode::OK)
}
