use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ImageResponse {
    pub id: String,
    pub file_name: String,
    pub content_type: String,
    pub size: u64,
}
