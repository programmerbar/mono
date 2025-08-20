use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct ProductType {
    pub id: String,
    pub title: String,
    pub created_at: String,
    pub updated_at: String,
}
