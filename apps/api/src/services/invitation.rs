use crate::{errors::ApiError, models::invitation::Invitation};
use chrono::Utc;

/// Service for managing invitations.
/// This service provides methods to create, retrieve, and claim invitations.
/// It interacts with the `invitation` table in the database.
#[derive(Clone)]
pub struct InvitationService {
    pool: sqlx::PgPool,
}

impl InvitationService {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self { pool }
    }

    /// Get an invitation by its ID.
    pub async fn get_by_email(&self, email: &str) -> Result<Option<Invitation>, ApiError> {
        sqlx::query_as!(
            Invitation,
            "SELECT * FROM invitation WHERE email = $1 AND claimed_at IS NULL AND expires_at > NOW()",
            email
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)
    }

    /// Create a new invitation for a given email.
    pub async fn new_invitation(&self, email: &str) -> Result<(), ApiError> {
        sqlx::query!(
            "INSERT INTO invitation (id, email, expires_at) VALUES ($1, $2, $3)",
            uuid::Uuid::new_v4().to_string(),
            email,
            Utc::now() + chrono::Duration::days(7)
        )
        .execute(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

        Ok(())
    }

    /// Claim an invitation by its ID.
    pub async fn claim(&self, id: &str) -> Result<(), ApiError> {
        sqlx::query!(
            "UPDATE invitation SET claimed_at = $1 WHERE id = $2",
            Utc::now(),
            id
        )
        .execute(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)?;
        Ok(())
    }

    /// Get all invitations that have not been claimed.
    pub async fn get_all(&self) -> Result<Vec<Invitation>, ApiError> {
        sqlx::query_as!(
            Invitation,
            "SELECT * FROM invitation WHERE claimed_at IS NULL AND expires_at > NOW()"
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)
    }

    /// Delete an invitation by its ID.
    pub async fn delete(&self, id: &str) -> Result<(), ApiError> {
        sqlx::query!("DELETE FROM invitation WHERE id = $1", id)
            .execute(&self.pool)
            .await
            .map_err(|_| ApiError::InternalServerError)?;
        Ok(())
    }
}
