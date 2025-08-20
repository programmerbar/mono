use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema)]
pub struct RootResponse<T> {
    /// Indicates whether the request was successful
    pub success: bool,
    /// Optional data returned by the API
    pub data: Option<T>,
}
