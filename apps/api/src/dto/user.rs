use serde::Serialize;
use utoipa::ToSchema;

use crate::models::user::User;

#[derive(Serialize, ToSchema)]
pub struct ProfileResponse {
    /// Unique identifier for the user
    pub id: String,
    /// Name of the user
    pub name: String,
    /// Email address of the user
    pub email: String,
    /// Optional Feide ID for the user
    pub feide_id: Option<String>,
    /// Role of the user in the system
    pub role: String,
    /// Number of extra beers the user can claim
    pub additional_beers: i32,
    /// Optional alternative email address for the user
    pub alt_email: Option<String>,
}

impl From<User> for ProfileResponse {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            name: user.name,
            email: user.email,
            feide_id: user.feide_id,
            role: user.role,
            additional_beers: user.additional_beers,
            alt_email: user.alt_email,
        }
    }
}
