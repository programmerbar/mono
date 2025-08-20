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
    pub fn is_board_member(&self) -> bool {
        self.role == "board"
    }
}
