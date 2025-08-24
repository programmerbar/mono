use crate::{errors::ApiError, models::session::Session};
use axum_extra::extract::cookie::{Cookie, SameSite};
use chrono::{Duration, Utc};
use uuid::Uuid;

pub const SESSION_COOKIE_NAME: &str = "auth_session";

#[derive(Clone)]
pub struct SessionService {
    pool: sqlx::PgPool,
}

impl SessionService {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self { pool }
    }

    pub async fn create_session(&self, user_id: String) -> Result<Session, ApiError> {
        let session = Session {
            id: Uuid::new_v4().to_string(),
            user_id,
            expires_at: Utc::now() + Duration::hours(24),
        };

        sqlx::query!(
            "INSERT INTO session (id, user_id, expires_at) VALUES ($1, $2, $3)",
            session.id,
            session.user_id,
            session.expires_at
        )
        .execute(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

        Ok(session)
    }

    pub async fn get_by_id(&self, session_id: &str) -> Result<Option<Session>, ApiError> {
        sqlx::query_as!(
            Session,
            "SELECT id, user_id, expires_at FROM session WHERE id = $1",
            session_id
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)
    }

    pub async fn find_valid_by_id(&self, session_id: &str) -> Result<Session, ApiError> {
        sqlx::query_as!(
            Session,
            "SELECT id, user_id, expires_at FROM session WHERE id = $1 AND expires_at > $2",
            session_id,
            Utc::now()
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|err| match err {
            sqlx::Error::RowNotFound => ApiError::Unauthorized,
            _ => ApiError::InternalServerError,
        })
    }

    pub async fn delete_session(&self, session_id: &str) -> Result<(), ApiError> {
        sqlx::query!("DELETE FROM session WHERE id = $1", session_id)
            .execute(&self.pool)
            .await
            .map_err(|_| ApiError::InternalServerError)?;
        Ok(())
    }

    pub fn create_session_cookie(&self, session_id: &str) -> Cookie<'static> {
        Cookie::build((SESSION_COOKIE_NAME, session_id.to_string()))
            .http_only(true)
            .secure(true) // Use HTTPS in production
            .same_site(SameSite::Lax)
            .max_age(cookie::time::Duration::days(1))
            .path("/")
            .build()
    }

    pub fn create_logout_cookie() -> Cookie<'static> {
        Cookie::build((SESSION_COOKIE_NAME, ""))
            .http_only(true)
            .secure(true)
            .same_site(SameSite::Lax)
            .max_age(cookie::time::Duration::seconds(0)) // Immediate expiry
            .path("/")
            .build()
    }
}
