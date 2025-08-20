use axum::{Json, extract::State};

use crate::{models::product::Product, state::AppState};

pub async fn all_products(State(state): State<AppState>) -> Json<Vec<Product>> {
    let products = state.product_repo.list().await.unwrap_or_else(|_| vec![]);

    Json(products)
}
