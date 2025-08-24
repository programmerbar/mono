use crate::{
    dto::{self, FullUser, UpdateUserInput},
    errors::ApiError,
    extractors::auth::{AuthorizedMember, AuthorizedMemberOrBoardMember},
};
use axum::{
    Json,
    extract::{Path, State},
    response::IntoResponse,
};
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::{dto::EventUser, state::AppState};

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::new()
        .routes(routes!(list_users))
        .routes(routes!(get_user, update_user))
        .routes(routes!(get_profile))
}

/// List all users, by default it only lists the active users.
///
/// This endpoint is accessible to authenticated users, including board members and regular members.
#[utoipa::path(
    get,
    path = "/users",
    responses(
        (status = 200, description = "A list of users", body = Vec<EventUser>),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Users"
)]
async fn list_users(State(state): State<AppState>) -> Result<impl IntoResponse, ApiError> {
    let users = state.user_service.list_active().await?;
    Ok(Json(users))
}

/// Get a user by ID.
///
/// This endpoint retrieves a user's profile information by their ID.
#[utoipa::path(
    get,
    path = "/users/{id}",
    params(
        ("id" = String, Path, description = "ID of the user to retrieve")
    ),
    responses(
        (status = 200, description = "User found", body = FullUser),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Users"
)]
async fn get_user(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<impl IntoResponse, ApiError> {
    let user = state.user_service.find_active_by_id(&id).await?;
    Ok(Json(FullUser::from(user)))
}

/// Update a user by ID.
///
/// A user can either updated themselves or a board member can update any user.
#[utoipa::path(
    put,
    path = "/users/{id}",
    params(
        ("id" = String, Path, description = "ID of the user to update")
    ),
    request_body = EventUser,
    responses(
        (status = 200, description = "User updated successfully", body = EventUser),
        (status = 401, description = "Unauthorized"),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Users"
)]
async fn update_user(
    State(state): State<AppState>,
    Path(id): Path<String>,
    auth: AuthorizedMemberOrBoardMember,
    Json(user): Json<UpdateUserInput>,
) -> Result<impl IntoResponse, ApiError> {
    match auth {
        // If request is made by a regular member, they can only update their own profile.
        AuthorizedMemberOrBoardMember::Member(auth) => {
            if id != auth.user.id {
                return Err(ApiError::Forbidden);
            }

            let updated_user = state.user_service.update(&id, &user).await?;
            Ok(Json(dto::FullUser::from(updated_user)))
        }
        // If request is made by a board member, they can update any user.
        AuthorizedMemberOrBoardMember::BoardMember(_) => {
            let updated_user = state.user_service.update(&id, &user).await?;
            Ok(Json(dto::FullUser::from(updated_user)))
        }
    }
}

/// Get profile information of the authenticated user.
#[utoipa::path(
    get,
    path = "/users/me",
    responses(
        (status = 200, description = "User profile", body = FullUser),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Users"
)]
async fn get_profile(auth: AuthorizedMember) -> Result<impl IntoResponse, ApiError> {
    Ok(Json(FullUser::from(auth.user)))
}
