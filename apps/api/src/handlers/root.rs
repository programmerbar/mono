use std::collections::HashMap;

use axum::Json;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
}

pub async fn root() -> Json<ApiResponse<HashMap<String, String>>> {
    let mut info = HashMap::new();
    info.insert("name".to_string(), "Programmerbar API".to_string());
    info.insert("version".to_string(), "0.1.0".to_string());

    Json(ApiResponse {
        success: true,
        data: Some(info),
    })
}
