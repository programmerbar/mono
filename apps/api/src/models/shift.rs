use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct Shift {
    pub id: String,
    pub event_id: String,
    pub start_at: DateTime<Utc>,
    pub end_at: DateTime<Utc>,
}
