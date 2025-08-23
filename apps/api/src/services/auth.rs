use crate::{
    errors::ApiError,
    models::{session::Session, user::User},
    services::{session::SessionService, user::UserService},
};

pub struct AuthService {
    session_service: SessionService,
    user_service: UserService,
}

impl AuthService {
    pub fn new(session_service: SessionService, user_service: UserService) -> Self {
        Self {
            session_service,
            user_service,
        }
    }

    pub async fn validate_session(&self, session_id: &str) -> Result<(Session, User), ApiError> {
        let session = self.session_service.find_valid_by_id(session_id).await?;
        let user = self
            .user_service
            .find_active_by_id(&session.user_id)
            .await?;
        Ok((session, user))
    }

    pub async fn delete_session(&self, session_id: &str) -> Result<(), ApiError> {
        self.session_service.delete_session(session_id).await
    }
}
