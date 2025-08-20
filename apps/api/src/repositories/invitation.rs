use crate::models::invitation::Invitation;
use sqlx::{PgPool, query, query_as};

pub struct InvitationRepository {
    pool: PgPool,
}

impl InvitationRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<Invitation>, sqlx::Error> {
        query_as!(Invitation, "SELECT * FROM invitation WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn create(&self, invitation: &Invitation) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO invitation (id, email, claimed_at, created_at, expires_at) VALUES ($1, $2, $3, $4, $5)",
            invitation.id,
            invitation.email,
            invitation.claimed_at,
            invitation.created_at,
            invitation.expires_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, invitation: &Invitation) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE invitation SET email = $2, claimed_at = $3, created_at = $4, expires_at = $5 WHERE id = $1",
            invitation.id,
            invitation.email,
            invitation.claimed_at,
            invitation.created_at,
            invitation.expires_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM invitation WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
