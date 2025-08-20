use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::models::product::Product;

#[derive(Serialize, Deserialize, Debug, Clone, ToSchema)]
pub struct CreateProductJson {
    /// Unique identifier for the product
    pub sku: Option<String>,
    /// Name of the product
    pub name: String,
    /// Description of the product
    pub description: Option<String>,
    /// Indicates if the product is sold out
    pub is_sold_out: bool,
    /// Price for ordinary customers
    pub ordinary_price: i32,
    /// Price for students
    pub student_price: i32,
    /// Internal price for the product
    pub internal_price: i32,
    /// Credits needed to claim the product internally
    pub credits: Option<i32>,
    /// Volume of the product, if applicable
    pub volume: Option<f32>,
    /// Alcohol content of the product, if applicable
    pub alcohol_content: Option<f32>,
    /// Variants of the product, if applicable
    pub variants: Option<String>,
    /// Image ID associated with the product, if any
    pub image_id: Option<String>,
    /// ID of the producer, if applicable
    pub producer_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct FullProduct {
    /// Unique identifier for the product
    pub id: String,
    /// Stock keeping unit for the product
    pub sku: Option<String>,
    /// Name of the product
    pub name: String,
    /// Description of the product
    pub description: Option<String>,
    /// Indicates if the product is sold out
    pub is_sold_out: bool,
    /// Price for ordinary customers
    pub ordinary_price: i32,
    /// Price for students
    pub student_price: i32,
    /// Internal price for the product
    pub internal_price: i32,
    /// Credits needed to claim the product internally
    pub credits: Option<i32>,
    /// Volume of the product, if applicable
    pub volume: Option<f32>,
    /// Alcohol content of the product, if applicable
    pub alcohol_content: Option<f32>,
    /// Variants of the product, if applicable
    pub variants: Option<String>,
    /// Image ID associated with the product, if any
    pub image_id: Option<String>,
    /// ID of the producer, if applicable
    pub producer_id: Option<String>,
    /// Timestamp when the product was created
    pub created_at: DateTime<Utc>,
    /// Timestamp when the product was last updated
    pub updated_at: DateTime<Utc>,
}

impl From<Product> for FullProduct {
    fn from(product: Product) -> Self {
        Self {
            id: product.id,
            sku: product.sku,
            name: product.name,
            description: product.description,
            is_sold_out: product.is_sold_out,
            ordinary_price: product.ordinary_price,
            student_price: product.student_price,
            internal_price: product.internal_price,
            credits: product.credits,
            volume: product.volume,
            alcohol_content: product.alcohol_content,
            variants: product.variants,
            image_id: product.image_id,
            producer_id: product.producer_id,
            created_at: DateTime::parse_from_rfc3339(&product.created_at)
                .unwrap()
                .with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&product.updated_at)
                .unwrap()
                .with_timezone(&Utc),
        }
    }
}
