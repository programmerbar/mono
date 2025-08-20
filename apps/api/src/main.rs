use axum::{Router, routing::get};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{self, layer::SubscriberExt, util::SubscriberInitExt};

use crate::{config::Config, state::AppState};

mod config;
mod extractors;
mod handlers;
mod models;
mod repositories;
mod state;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                format!(
                    "{}=debug,tower_http=debug,axum::rejection=trace",
                    env!("CARGO_CRATE_NAME")
                )
                .into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = Config::from_env();
    let state = AppState::from_config(config.clone()).await;

    let app = Router::new()
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http())
        .route("/", get(handlers::root::root))
        .route("/health", get(handlers::health::health))
        .route("/products", get(handlers::products::all_products))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", config.server_port)).await?;

    tracing::info!("🚀 Programmerbar API server starting on http://0.0.0.0:8000");

    axum::serve(listener, app).await?;

    Ok(())
}
