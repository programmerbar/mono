use axum::{Router, response::Json, routing::get};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{self, layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Serialize, Deserialize)]
struct HealthResponse {
    status: String,
    message: String,
}

#[derive(Serialize, Deserialize)]
struct ApiResponse<T> {
    success: bool,
    data: Option<T>,
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        message: "Programmerbar API is running".to_string(),
    })
}

async fn root() -> Json<ApiResponse<HashMap<String, String>>> {
    let mut info = HashMap::new();
    info.insert("name".to_string(), "Programmerbar API".to_string());
    info.insert("version".to_string(), "0.1.0".to_string());

    Json(ApiResponse {
        success: true,
        data: Some(info),
    })
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
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

    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health))
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await?;

    tracing::info!("🚀 Programmerbar API server starting on http://0.0.0.0:8000");

    axum::serve(listener, app).await?;

    Ok(())
}
