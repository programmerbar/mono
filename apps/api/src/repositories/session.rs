use sqlx::{Pool, Postgres, query};

use crate::models::session::Session;

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
}
