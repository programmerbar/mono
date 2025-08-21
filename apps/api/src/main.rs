use tower_http::{cors::CorsLayer, normalize_path::NormalizePathLayer, trace::TraceLayer};
use tracing_subscriber::{self, layer::SubscriberExt, util::SubscriberInitExt};
use utoipa::OpenApi;
use utoipa_axum::{router::OpenApiRouter, routes};
use utoipa_swagger_ui::SwaggerUi;

use crate::{config::Config, openapi::ApiDoc, state::AppState};

mod config;
mod dto;
mod errors;
mod extractors;
mod handlers;
mod models;
mod openapi;
mod providers;
mod repositories;
mod services;
mod state;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    init_tracing();

    let config = Config::from_env();
    let state = AppState::from_config(config.clone()).await;

    let (router, api) = OpenApiRouter::with_openapi(ApiDoc::openapi())
        // General endpoints
        .routes(routes![handlers::root::root])
        .routes(routes![handlers::health::health])
        // Product endpoints
        .routes(routes![handlers::products::all_products])
        .routes(routes![handlers::products::create_product])
        .routes(routes![handlers::products::get_product_by_id])
        // Event endpoints
        .routes(routes![handlers::event::all_events])
        // Authentication endpoints
        .routes(routes![handlers::auth::feide_auth])
        .routes(routes![handlers::auth::feide_callback])
        .routes(routes![handlers::auth::logout])
        // User endpoints
        .routes(routes![handlers::profile::get_profile])
        // Image endpoints
        .routes(routes![handlers::image::upload_image])
        .routes(routes![handlers::image::get_image_by_id])
        // Status endpoints
        .routes(routes![handlers::status::status])
        .routes(routes![handlers::status::set_status])
        // Admin endpoints
        .routes(routes![handlers::admin::test_admin])
        .split_for_parts();

    let app = router
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", api))
        // Middleware / Layers
        .layer(cors_layer())
        .layer(TraceLayer::new_for_http())
        .layer(NormalizePathLayer::trim_trailing_slash())
        // State
        .with_state(state);

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
        .allow_origin(
            "http://localhost:5173"
                .parse::<axum::http::HeaderValue>()
                .unwrap(),
        ) // SvelteKit dev server
        .allow_origin(
            "https://programmer.bar"
                .parse::<axum::http::HeaderValue>()
                .unwrap(),
        ) // Production
        .allow_methods([axum::http::Method::GET, axum::http::Method::POST])
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
        ])
        .allow_credentials(true)
}
