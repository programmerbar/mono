use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct ProductProductType {
    pub product_id: String,
    pub product_type_id: String,
}
