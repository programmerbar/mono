use crate::{
    errors::ApiError,
    models::{session::Session, user::User},
    repositories::{session::SessionRepository, user::UserRepository},
};

pub struct AuthService {
    session_repo: SessionRepository,
    user_repo: UserRepository,
}

impl AuthService {
    pub fn new(session_repo: SessionRepository, user_repo: UserRepository) -> Self {
        Self {
            session_repo,
            user_repo,
        }
    }

    pub async fn validate_session(&self, session_id: &str) -> Result<(Session, User), ApiError> {
        let session = self.session_repo.find_valid_by_id(session_id).await?;
        let user = self.user_repo.find_active_by_id(&session.user_id).await?;
        Ok((session, user))
    }

    pub async fn delete_session(&self, session_id: &str) -> Result<(), ApiError> {
        self.session_repo.delete(session_id).await
    }
}
