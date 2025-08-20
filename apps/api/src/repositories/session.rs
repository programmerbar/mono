use chrono::Utc;
use sqlx::{Pool, Postgres, query, query_as};

use crate::{errors::ApiError, models::session::Session};

pub struct SessionRepository {
    pool: Pool<Postgres>,
}

impl SessionRepository {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }

    pub async fn create(&self, session: &Session) -> sqlx::Result<()> {
        query!(
            "INSERT INTO session (id, user_id, expires_at) VALUES ($1, $2, $3)",
            session.id,
            session.user_id,
            session.expires_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn get_by_id(&self, session_id: &str) -> Result<Option<Session>, sqlx::Error> {
        query_as!(
            Session,
            "SELECT id, user_id, expires_at FROM session WHERE id = $1",
            session_id
        )
        .fetch_optional(&self.pool)
        .await
    }

    pub async fn find_valid_by_id(&self, session_id: &str) -> Result<Session, ApiError> {
        query_as!(
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

    pub async fn delete(&self, session_id: &str) -> Result<(), ApiError> {
        query!("DELETE FROM session WHERE id = $1", session_id)
            .execute(&self.pool)
            .await
            .map_err(|_| ApiError::InternalServerError)?;
        Ok(())
    }
}
