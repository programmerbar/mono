use std::sync::Arc;

use axum::extract::FromRef;
use axum_extra::extract::cookie::Key;
use redis::Client as RedisClient;
use s3::{Bucket, Region, creds::Credentials};

use crate::{
    config::Config,
    providers::feide::FeideProvider,
    services::{
        auth::AuthService, beer::BeerService, event::EventService, image::ImageService,
        invitation::InvitationService, notification::NotificationService, product::ProductService,
        session::SessionService, shift::ShiftService, status::StatusService, user::UserService,
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
    pub auth_service: AuthService,
    pub invitation_service: InvitationService,
    pub session_service: SessionService,
    pub status_service: StatusService,
    pub user_service: UserService,
    pub image_service: ImageService,
    pub event_service: EventService,
    pub product_service: ProductService,
    pub notification_service: NotificationService,
    pub beer_service: BeerService,
    pub shift_service: ShiftService,

    // Providers
    pub feide_provider: FeideProvider,
}

impl AppState {
    pub async fn from_config(config: Config) -> Self {
        let pool = sqlx::postgres::PgPoolOptions::new()
            .max_connections(10)
            .connect(config.database_url.as_str())
            .await
            .expect("Failed to connect to the database");

        tracing::info!("Connected to postgres database");

        sqlx::migrate!("./migrations").run(&pool).await.unwrap();

        tracing::info!("Database migrations applied");

        let key = generate_key();

        let bucket = create_bucket(&config);

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
        let user_service = UserService::new(pool.clone());
        let session_service = SessionService::new(pool.clone());
        let invitation_service = InvitationService::new(pool.clone());
        let image_service = ImageService::new(pool.clone());
        let event_service = EventService::new(pool.clone());
        let product_service = ProductService::new(pool.clone());
        let notification_service = NotificationService::new(pool.clone());
        let beer_service = BeerService::new(pool.clone());
        let auth_service = AuthService::new(pool.clone());
        let shift_service = ShiftService::new(pool.clone());

        let status_service = StatusService::new(redis.clone());

        let feide_provider = FeideProvider::new(
            config.feide_client_id.clone(),
            config.feide_client_secret.clone(),
            config.feide_redirect_uri.clone(),
        );

        Self {
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
            notification_service,
            beer_service,
            shift_service,

            // Providers
            feide_provider,
        }
    }
}

/// Create a cookie key for session management.
/// Use the AUTH_SECRET environment variable if available, so that
/// cookies are not encrypted with a random key on each restart.
fn generate_key() -> Key {
    if let Ok(auth_secret) = std::env::var("AUTH_SECRET") {
        Key::from(auth_secret.as_bytes())
    } else {
        Key::generate()
    }
}

/// Create an S3 bucket using the configuration provided.
fn create_bucket(config: &Config) -> Box<Bucket> {
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

    Bucket::new(bucket_name, region, credentials).unwrap()
}

// This allows us to extract the Key from the AppState in handlers
impl FromRef<AppState> for axum_extra::extract::cookie::Key {
    fn from_ref(state: &AppState) -> Self {
        state.key.clone()
    }
}
