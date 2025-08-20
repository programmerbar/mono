use axum::{
    Router,
    routing::{get, post},
};
use tower_http::{cors::CorsLayer, normalize_path::NormalizePathLayer, trace::TraceLayer};
use tracing_subscriber::{self, layer::SubscriberExt, util::SubscriberInitExt};
use utoipa_swagger_ui::SwaggerUi;

use crate::{config::Config, state::AppState};

mod config;
mod dto;
mod errors;
mod extractors;
mod handlers;
mod models;
mod providers;
mod repositories;
mod services;
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
        // Routes
        .route("/", get(handlers::root::root))
        .route("/health", get(handlers::health::health))
        .route("/events", get(handlers::event::all_events))
        .route("/products", get(handlers::products::all_products))
        .route("/products", post(handlers::products::create_product))
        .route("/products/{id}", get(handlers::products::get_product_by_id))
        .route("/auth/feide", get(handlers::auth::feide_auth))
        .route("/auth/feide/callback", get(handlers::auth::feide_callback))
        .route("/auth/logout", post(handlers::auth::logout))
        .route("/profile", get(handlers::profile::get_profile))
        .route("/images/upload", post(handlers::image::upload_image))
        .route("/images/:id", get(handlers::image::get_image_by_id))
        // Swagger
        // .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        // Middleware / Layers
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http())
        .layer(NormalizePathLayer::trim_trailing_slash())
        // State
        .with_state(state);

    let listener =
        tokio::net::TcpListener::bind(format!("127.0.0.1:{}", config.server_port)).await?;

    tracing::info!(
        "🚀 Programmerbar API server starting on http://127.0.0.1:{}",
        config.server_port
    );

    axum::serve(listener, app).await?;

    Ok(())
}
