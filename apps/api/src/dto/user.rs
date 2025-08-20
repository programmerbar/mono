use serde::Serialize;

use crate::models::user::User;

#[derive(Serialize)]
pub struct ProfileResponse {
    pub id: String,
    pub name: String,
    pub email: String,
    pub feide_id: Option<String>,
    pub role: String,
    pub additional_beers: i32,
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
