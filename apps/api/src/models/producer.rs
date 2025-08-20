use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct Producer {
    pub id: String,
    pub name: String,
    pub image_id: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}
