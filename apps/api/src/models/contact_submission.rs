use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct ContactSubmission {
    pub id: String,
    pub name: String,
    pub email: String,
    pub message: String,
    pub submitted_at: DateTime<Utc>,
    pub ip_address: Option<String>,
}
