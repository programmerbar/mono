use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
    pub feide_id: Option<String>,
    pub role: String,
    pub additional_beers: i32,
    pub alt_email: Option<String>,
    pub is_deleted: bool,
}

impl User {
    pub fn create(id: String, name: String, email: String, feide_id: String) -> Self {
        Self {
            id,
            name,
            email,
            feide_id: Some(feide_id),
            role: "normal".to_string(),
            additional_beers: 0,
            alt_email: None,
            is_deleted: false,
        }
    }

    pub fn is_board_member(&self) -> bool {
        self.role == "board"
    }
}
