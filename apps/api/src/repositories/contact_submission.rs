use crate::models::contact_submission::ContactSubmission;
use sqlx::{PgPool, query, query_as};

pub struct ContactSubmissionRepository {
    pool: PgPool,
}

impl ContactSubmissionRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<ContactSubmission>, sqlx::Error> {
        query_as!(
            ContactSubmission,
            "SELECT * FROM contact_submission WHERE id = $1",
            id
        )
        .fetch_optional(&self.pool)
        .await
    }

    pub async fn create(&self, contact_submission: &ContactSubmission) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO contact_submission (id, name, email, message, submitted_at, ip_address) VALUES ($1, $2, $3, $4, $5, $6)",
            contact_submission.id,
            contact_submission.name,
            contact_submission.email,
            contact_submission.message,
            contact_submission.submitted_at,
            contact_submission.ip_address
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, contact_submission: &ContactSubmission) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE contact_submission SET name = $2, email = $3, message = $4, submitted_at = $5, ip_address = $6 WHERE id = $1",
            contact_submission.id,
            contact_submission.name,
            contact_submission.email,
            contact_submission.message,
            contact_submission.submitted_at,
            contact_submission.ip_address
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM contact_submission WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
