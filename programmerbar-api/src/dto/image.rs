use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ImageResponse {
    /// Unique identifier for the image
    pub id: String,
    /// File name of the image
    pub file_name: String,
    /// Content type of the image
    pub content_type: String,
    /// Size of the image in bytes
    pub size: u64,
}
