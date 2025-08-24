use tower_http::{cors::CorsLayer, normalize_path::NormalizePathLayer, trace::TraceLayer};
use tracing_subscriber::{self, layer::SubscriberExt, util::SubscriberInitExt};
use utoipa::OpenApi;
use utoipa_axum::router::OpenApiRouter;
use utoipa_swagger_ui::SwaggerUi;

use crate::{
    config::Config,
    handlers::{admin, auth, event, health, image, invitation, product, status, user},
    openapi::ApiDoc,
    state::AppState,
};

mod config;
mod dto;
mod errors;
mod extractors;
mod handlers;
mod models;
mod openapi;
mod providers;
mod services;
mod state;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    init_tracing();

    let config = Config::from_env();
    let state = AppState::from_config(config.clone()).await;

    let (router, api) = OpenApiRouter::with_openapi(ApiDoc::openapi())
        .merge(health::router())
        .merge(image::router())
        .merge(status::router())
        .merge(admin::router())
        .merge(user::router())
        .merge(invitation::router())
        .merge(auth::router())
        .merge(event::router())
        .merge(product::router())
        .split_for_parts();

    // Middleware / Layers
    let router = router
        .layer(cors_layer())
        .layer(TraceLayer::new_for_http())
        .layer(NormalizePathLayer::trim_trailing_slash());

    // State
    let router = router.with_state(state);

    let app = router.merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", api));

    let port = config.server_port;
    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{port}")).await?;

    tracing::info!("🚀 Programmerbar API server starting on http://127.0.0.1:{port}",);
    tracing::info!("🤓 Visit http://127.0.0.1:{port}/swagger-ui for the API documentation");

    axum::serve(listener, app).await?;

    Ok(())
}

fn init_tracing() {
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
}

fn cors_layer() -> CorsLayer {
    CorsLayer::new()
        .allow_origin([
            "http://localhost:5173".parse().unwrap(),  // Dev frontend
            "https://programmer.bar".parse().unwrap(), // Production frontend
        ])
        .allow_methods([
            axum::http::Method::GET,
            axum::http::Method::POST,
            axum::http::Method::PUT,
            axum::http::Method::DELETE,
        ])
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
        ])
        .allow_credentials(true)
}
