use crate::{errors::ApiError, models::session::Session, repositories::session::SessionRepository};
use axum_extra::extract::cookie::{Cookie, SameSite};
use chrono::{Duration, Utc};
use uuid::Uuid;

pub struct SessionService {
    session_repo: SessionRepository,
}

impl SessionService {
    pub fn new(session_repo: SessionRepository) -> Self {
        Self { session_repo }
    }

    pub async fn create_session(&self, user_id: String) -> Result<Session, ApiError> {
        let session = Session {
            id: Uuid::new_v4().to_string(),
            user_id,
            expires_at: Utc::now() + Duration::hours(24),
        };

        self.session_repo
            .create(&session)
            .await
            .map_err(|_| ApiError::InternalServerError)?;

        Ok(session)
    }

    pub fn create_session_cookie(&self, session_id: &str) -> Cookie<'static> {
        Cookie::build(("session_id", session_id.to_string()))
            .http_only(true)
            .secure(true) // Use HTTPS in production
            .same_site(SameSite::Lax)
            .max_age(cookie::time::Duration::days(1))
            .path("/")
            .build()
    }

    pub async fn delete_session(&self, session_id: &str) -> Result<(), ApiError> {
        self.session_repo
            .delete(session_id)
            .await
            .map_err(|_| ApiError::InternalServerError)
    }

    pub fn create_logout_cookie() -> Cookie<'static> {
        Cookie::build(("session_id", ""))
            .http_only(true)
            .secure(true)
            .same_site(SameSite::Lax)
            .max_age(cookie::time::Duration::seconds(0)) // Immediate expiry
            .path("/")
            .build()
    }
}
