use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct UsersGroup {
    pub user_id: String,
    pub group_id: String,
}
