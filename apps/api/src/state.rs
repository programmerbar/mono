use std::sync::Arc;

use axum::extract::FromRef;
use axum_extra::extract::cookie::Key;
use s3::{Bucket, Region, creds::Credentials};

use crate::{
    config::Config,
    providers::feide::FeideProvider,
    repositories::{
        claimed_credit::ClaimedCreditRepository, contact_submission::ContactSubmissionRepository,
        event::EventRepository, group::GroupRepository, image::ImageRepository,
        invitation::InvitationRepository, notification::NotificationRepository,
        producer::ProducerRepository, product::ProductRepository,
        product_product_type::ProductProductTypeRepository, product_type::ProductTypeRepository,
        session::SessionRepository, shift::ShiftRepository, user::UserRepository,
        user_shift::UserShiftRepository, users_group::UsersGroupRepository,
    },
    services::{auth::AuthService, session::SessionService},
};

#[derive(Clone)]
pub struct AppState {
    // General
    pub config: Config,
    pub key: Key,
    pub bucket: Arc<Box<Bucket>>,

    // Repositories
    pub claimed_credit_repo: Arc<ClaimedCreditRepository>,
    pub contact_submission_repo: Arc<ContactSubmissionRepository>,
    pub event_repo: Arc<EventRepository>,
    pub group_repo: Arc<GroupRepository>,
    pub image_repo: Arc<ImageRepository>,
    pub invitation_repo: Arc<InvitationRepository>,
    pub notification_repo: Arc<NotificationRepository>,
    pub producer_repo: Arc<ProducerRepository>,
    pub product_product_type_repo: Arc<ProductProductTypeRepository>,
    pub product_type_repo: Arc<ProductTypeRepository>,
    pub product_repo: Arc<ProductRepository>,
    pub session_repo: Arc<SessionRepository>,
    pub shift_repo: Arc<ShiftRepository>,
    pub user_shift_repo: Arc<UserShiftRepository>,
    pub user_repo: Arc<UserRepository>,
    pub user_group_repo: Arc<UsersGroupRepository>,

    // Services
    pub auth_service: Arc<AuthService>,
    pub session_service: Arc<SessionService>,

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

        sqlx::migrate!("./migrations")
            .run(&pool)
            .await
            .expect("Failed to run database migrations");

        let key = Key::generate();

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

        let bucket = Arc::new(Bucket::new(bucket_name, region, credentials).unwrap());

        let claimed_credit_repo = Arc::new(ClaimedCreditRepository::new(pool.clone()));
        let contact_submission_repo = Arc::new(ContactSubmissionRepository::new(pool.clone()));
        let event_repo = Arc::new(EventRepository::new(pool.clone()));
        let group_repo = Arc::new(GroupRepository::new(pool.clone()));
        let image_repo = Arc::new(ImageRepository::new(pool.clone()));
        let invitation_repo = Arc::new(InvitationRepository::new(pool.clone()));
        let notification_repo = Arc::new(NotificationRepository::new(pool.clone()));
        let producer_repo = Arc::new(ProducerRepository::new(pool.clone()));
        let product_product_type_repo = Arc::new(ProductProductTypeRepository::new(pool.clone()));
        let product_type_repo = Arc::new(ProductTypeRepository::new(pool.clone()));
        let product_repo = Arc::new(ProductRepository::new(pool.clone()));
        let session_repo = Arc::new(SessionRepository::new(pool.clone()));
        let shift_repo = Arc::new(ShiftRepository::new(pool.clone()));
        let user_shift_repo = Arc::new(UserShiftRepository::new(pool.clone()));
        let user_repo = Arc::new(UserRepository::new(pool.clone()));
        let user_group_repo = Arc::new(UsersGroupRepository::new(pool.clone()));

        // Services
        let auth_service = Arc::new(AuthService::new(
            SessionRepository::new(pool.clone()),
            UserRepository::new(pool.clone()),
        ));

        let session_service = Arc::new(SessionService::new(SessionRepository::new(pool.clone())));

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

            // Repositories
            claimed_credit_repo,
            contact_submission_repo,
            event_repo,
            group_repo,
            image_repo,
            invitation_repo,
            notification_repo,
            producer_repo,
            product_product_type_repo,
            product_type_repo,
            product_repo,
            session_repo,
            shift_repo,
            user_shift_repo,
            user_repo,
            user_group_repo,

            // Services
            auth_service,
            session_service,

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
