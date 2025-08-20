use tower_http::{cors::CorsLayer, normalize_path::NormalizePathLayer, trace::TraceLayer};
use tracing_subscriber::{self, layer::SubscriberExt, util::SubscriberInitExt};
use utoipa::{
    Modify, OpenApi,
    openapi::security::{ApiKey, ApiKeyValue, SecurityScheme},
};
use utoipa_axum::{router::OpenApiRouter, routes};
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

#[derive(OpenApi)]
#[openapi(
    modifiers(&SecurityAddon),
    tags(
        (name = "General", description = "General API endpoints"),
        (name = "Health", description = "Health check endpoints"),
        (name = "Products", description = "Product management"),
        (name = "Events", description = "Event and shift management"),
        (name = "Authentication", description = "User authentication via Feide"),
        (name = "Profile", description = "User profile management"),
        (name = "Images", description = "Image upload and retrieval"),
        (name = "Status", description = "Status of the bar")
    )
)]
struct ApiDoc;

struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "session",
                SecurityScheme::ApiKey(ApiKey::Cookie(ApiKeyValue::new("session_token"))),
            )
        }
    }
}

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
        .split_for_parts();

    let app = router
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", api))
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
