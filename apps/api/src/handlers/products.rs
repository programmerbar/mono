use axum::{
    Json,
    extract::{Path, State},
};

use crate::{
    dto::product::CreateProductJson,
    errors::ApiError,
    models::{auth::AuthorizedBoardMember, product::Product},
    state::AppState,
};

pub async fn all_products(State(state): State<AppState>) -> Json<Vec<Product>> {
    let products = state.product_repo.list().await.unwrap_or_else(|_| vec![]);

    Json(products)
}

pub async fn get_product_by_id(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Product>, ApiError> {
    let product = state
        .product_repo
        .get_by_id(&id)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    match product {
        Some(product) => Ok(Json(product)),
        None => Err(ApiError::NotFound(format!(
            "Product with id '{}' not found",
            id
        ))),
    }
}

pub async fn create_product(
    State(state): State<AppState>,
    _auth: AuthorizedBoardMember,
    Json(product): Json<CreateProductJson>,
) -> Result<Json<Product>, ApiError> {
    let new_product = Product {
        id: uuid::Uuid::new_v4().to_string(),
        name: product.name,
        description: product.description,
        sku: product.sku,
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
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
    };

    state
        .product_repo
        .create(&new_product)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    Ok(Json(new_product))
}
