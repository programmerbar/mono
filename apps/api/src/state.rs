use std::sync::Arc;

use axum::extract::FromRef;
use axum_extra::extract::cookie::Key;
use redis::Client as RedisClient;
use s3::{Bucket, Region, creds::Credentials};

use crate::{
    config::Config,
    providers::feide::FeideProvider,
    services::{
        auth::AuthService, event::EventService, image::ImageService, invitation::InvitationService,
        product::ProductService, session::SessionService, status::StatusService, user::UserService,
    },
};

#[derive(Clone)]
pub struct AppState {
    // General
    pub config: Config,
    pub key: Key,
    pub bucket: Box<Bucket>,
    pub redis: Arc<RedisClient>,

    // Services
    pub auth_service: Arc<AuthService>,
    pub invitation_service: Arc<InvitationService>,
    pub session_service: Arc<SessionService>,
    pub status_service: Arc<StatusService>,
    pub user_service: Arc<UserService>,
    pub image_service: Arc<ImageService>,
    pub event_service: Arc<EventService>,
    pub product_service: Arc<ProductService>,

    // Providers
    pub feide_provider: Arc<FeideProvider>,
}

impl AppState {
    pub async fn from_config(config: Config) -> Self {
        let pool = sqlx::postgres::PgPoolOptions::new()
            .max_connections(5)
            .connect(config.database_url.as_str())
            .await
            .expect("Failed to connect to the database");

        tracing::info!("Connected to the database at {}", config.database_url);
        tracing::info!("Using database pool with max connections: {}", 5);

        tracing::info!("Running database migrations...");
        match sqlx::migrate!("./migrations").run(&pool).await {
            Ok(_) => {
                tracing::info!("✅ Database migrations completed successfully");
            }
            Err(e) => {
                tracing::error!("❌ Failed to run database migrations: {}", e);
                std::process::exit(1);
            }
        }

        let key = if let Ok(auth_secret) = std::env::var("AUTH_SECRET") {
            Key::from(auth_secret.as_bytes())
        } else {
            Key::generate()
        };

        let bucket_name = &config.s3_bucket;
        let region = Region::Custom {
            region: config.s3_region.clone(),
            endpoint: config.s3_endpoint.clone(),
        };
        let credentials = Credentials::new(
            Some(&config.s3_access_key),
            Some(&config.s3_secret_key),
            None,
            None,
            None,
        )
        .expect("Failed to create S3 credentials");

        let bucket = Bucket::new(bucket_name, region, credentials).unwrap();

        // Initialize Redis client
        let redis = Arc::new(
            RedisClient::open(config.redis_url.as_str()).expect("Failed to create Redis client"),
        );

        // Test Redis connection
        let mut conn = redis.get_connection().expect("Failed to connect to Redis");
        redis::cmd("PING")
            .query::<String>(&mut conn)
            .expect("Failed to ping Redis");

        tracing::info!("Connected to Redis at {}", config.redis_url);

        // Services
        let user_service = Arc::new(UserService::new(pool.clone()));
        let session_service = Arc::new(SessionService::new(pool.clone()));
        let invitation_service = Arc::new(InvitationService::new(pool.clone()));
        let image_service = Arc::new(ImageService::new(pool.clone()));
        let event_service = Arc::new(EventService::new(pool.clone()));
        let product_service = Arc::new(ProductService::new(pool.clone()));

        let auth_service = Arc::new(AuthService::new(
            SessionService::new(pool.clone()),
            UserService::new(pool.clone()),
        ));

        let status_service = Arc::new(StatusService::new(redis.clone()));

        let feide_provider = Arc::new(FeideProvider::new(
            config.feide_client_id.clone(),
            config.feide_client_secret.clone(),
            config.feide_redirect_uri.clone(),
        ));

        AppState {
            // General
            config,
            key,
            bucket,
            redis,

            // Services
            auth_service,
            invitation_service,
            session_service,
            status_service,
            user_service,
            image_service,
            event_service,
            product_service,

            // Providers
            feide_provider,
        }
    }
}

// This allows us to extract the Key from the AppState in handlers
impl FromRef<AppState> for axum_extra::extract::cookie::Key {
    fn from_ref(state: &AppState) -> Self {
        state.key.clone()
    }
}
