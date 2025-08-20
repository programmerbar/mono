use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema, Clone, Debug)]
pub struct StatusResponse {
    /// The status code of the bar
    pub status: i32,
    /// The status message
    pub message: String,
}

#[derive(Serialize, Deserialize, ToSchema, Clone, Debug)]
pub struct StatusRequest {
    /// The new status code for the bar
    pub status: i32,
}
