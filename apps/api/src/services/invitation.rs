use crate::{errors::ApiError, models::invitation::Invitation};
use chrono::Utc;
use sqlx::{Pool, Postgres, query, query_as};

#[derive(Clone)]
pub struct InvitationService {
    pool: Pool<Postgres>,
}

impl InvitationService {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }

    pub async fn get_by_email(&self, email: &str) -> Result<Option<Invitation>, ApiError> {
        query_as!(
            Invitation,
            "SELECT * FROM invitation WHERE email = $1 AND claimed_at IS NULL AND expires_at > NOW()",
            email
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)
    }

    pub async fn create(&self, invitation: &Invitation) -> Result<(), ApiError> {
        query!(
            "INSERT INTO invitation (id, email, claimed_at, created_at, expires_at) VALUES ($1, $2, $3, $4, $5)",
            invitation.id,
            invitation.email,
            invitation.claimed_at,
            invitation.created_at,
            invitation.expires_at
        )
        .execute(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)?;
        Ok(())
    }

    pub async fn claim(&self, id: &str) -> Result<(), ApiError> {
        query!(
            "UPDATE invitation SET claimed_at = $1 WHERE id = $2",
            Utc::now(),
            id
        )
        .execute(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)?;
        Ok(())
    }
}
