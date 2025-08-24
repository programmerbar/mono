use serde::{Deserialize, Serialize};
use serde_email::Email;
use utoipa::ToSchema;

use crate::models::user::User;

#[derive(Serialize, Deserialize, Debug, Clone, ToSchema)]
pub struct FullUser {
    /// Unique identifier for the user
    pub id: String,
    /// Name of the user
    pub name: String,
    /// Email address of the user
    #[schema(value_type = String, format = "email")]
    pub email: Email,
    /// Optional Feide ID for the user
    pub feide_id: Option<String>,
    /// Role of the user in the system
    pub role: String,
    /// Number of extra beers the user can claim
    pub additional_beers: i32,
    /// Optional alternative email address for the user
    pub alt_email: Option<String>,
}

impl From<User> for FullUser {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            name: user.name,
            email: Email::from_string(user.email).expect("Should always be valid email"),
            feide_id: user.feide_id,
            role: user.role,
            additional_beers: user.additional_beers,
            alt_email: user.alt_email,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, ToSchema)]
pub struct UpdateUserInput {
    /// (Optional) Feide ID for the user
    #[schema(value_type = String, format = "email")]
    pub alt_email: Option<Email>,
    /// (Optional) Phone number of the user
    pub phone: Option<String>,
}
