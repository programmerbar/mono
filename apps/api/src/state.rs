#![allow(dead_code)] // TODO REMOVE

use std::sync::Arc;

use crate::{
    config::Config,
    repositories::{
        claimed_credit::ClaimedCreditRepository, contact_submission::ContactSubmissionRepository,
        event::EventRepository, group::GroupRepository, image::ImageRepository,
        invitation::InvitationRepository, notification::NotificationRepository,
        producer::ProducerRepository, product::ProductRepository,
        product_product_type::ProductProductTypeRepository, product_type::ProductTypeRepository,
        session::SessionRepository, user::UserRepository, user_shift::UserShiftRepository,
    },
};

#[derive(Clone)]
pub struct AppState {
    pub config: Config,

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
    pub user_shift_repo: Arc<UserShiftRepository>,
    pub user_repo: Arc<UserRepository>,
    pub user_group_repo: Arc<GroupRepository>,
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
        let user_shift_repo = Arc::new(UserShiftRepository::new(pool.clone()));
        let user_repo = Arc::new(UserRepository::new(pool.clone()));
        let user_group_repo = Arc::new(GroupRepository::new(pool.clone()));

        AppState {
            config,
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
            user_shift_repo,
            user_repo,
            user_group_repo,
        }
    }
}
