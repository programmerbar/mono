use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct Image {
    pub id: String,
    pub filename: String,
    pub size: i32,
    pub r#type: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
