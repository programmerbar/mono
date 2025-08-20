use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Serialize, Debug, Clone, Deserialize)]
pub struct ClaimedCredit {
    pub id: String,
    pub user_id: String,
    pub product_id: String,
    pub credit_cost: i32,
    pub created_at: DateTime<Utc>,
}
