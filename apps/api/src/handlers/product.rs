use axum::{
    Json,
    extract::{Path, State},
};
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::{
    dto::{self, CreateProductJson, FullProduct},
    errors::ApiError,
    extractors::auth::AuthorizedBoardMember,
    models::product::Product,
    state::AppState,
};

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::new()
        .routes(routes!(all_products, create_product))
        .routes(routes!(get_product_by_id))
}

/// Get all products available in the bar.
///
/// Returns a complete list of all products including beers, beverages, and other items
/// available for purchase. This endpoint is public and does not require authentication.
/// Each product includes pricing information, availability status, and metadata.
#[utoipa::path(
    get,
    path = "/products",
    responses(
        (status = 200, description = "List of all products", body = Vec<dto::FullProduct>)
    ),
    tag = "Products"
)]
async fn all_products(State(state): State<AppState>) -> Json<Vec<dto::FullProduct>> {
    let products = state
        .product_service
        .list()
        .await
        .unwrap_or_else(|_| vec![])
        .into_iter()
        .map(FullProduct::from)
        .collect::<Vec<_>>();

    Json(products)
}

/// Create a new product in the bar inventory.
///
/// Adds a new product to the bar's inventory system. This endpoint is restricted to
/// board members only as it involves inventory management and pricing decisions.
/// The created product will be immediately available for purchase.
///
/// # Authentication
/// Requires board member privileges (role: "board").
///
/// # Request Body
/// Must include all required product information including name, pricing, and metadata.
#[utoipa::path(
    post,
    path = "/products",
    request_body = CreateProductJson,
    responses(
        (status = 201, description = "Product created", body = dto::FullProduct),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("session" = [])
    ),
    tag = "Products"
)]
async fn create_product(
    State(state): State<AppState>,
    _auth: AuthorizedBoardMember,
    Json(product): Json<CreateProductJson>,
) -> Result<Json<dto::FullProduct>, ApiError> {
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

    let created_product = state
        .product_service
        .create(&new_product)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

    Ok(Json(created_product.into()))
}

/// Get a specific product by its ID.
///
/// Retrieves detailed information about a single product including its pricing,
/// availability, alcohol content, and other metadata. This endpoint is public
/// and does not require authentication.
///
/// # Parameters
/// * `id` - The unique identifier of the product to retrieve
#[utoipa::path(
    get,
    path = "/products/{id}",
    params(
        ("id" = String, Path, description = "Product ID")
    ),
    responses(
        (status = 200, description = "Product found", body = dto::FullProduct),
        (status = 404, description = "Product not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Products"
)]
async fn get_product_by_id(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<dto::FullProduct>, ApiError> {
    let product = state
        .product_service
        .get_by_id(&id)
        .await
        .map_err(|_| ApiError::InternalServerError)?
        .ok_or_else(|| ApiError::NotFound(format!("Product with id '{id}' not found")))?
        .into();

    Ok(Json(product))
}
