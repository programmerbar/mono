use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CreateProductJson {
    pub sku: Option<String>,
    pub name: String,
    pub description: Option<String>,
    pub is_sold_out: bool,
    pub ordinary_price: i32,
    pub student_price: i32,
    pub internal_price: i32,
    pub credits: Option<i32>,
    pub volume: Option<f32>,
    pub alcohol_content: Option<f32>,
    pub variants: Option<String>,
    pub image_id: Option<String>,
    pub producer_id: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}
