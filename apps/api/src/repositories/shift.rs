use crate::models::shift::Shift;
use sqlx::{PgPool, query, query_as};

pub struct ShiftRepository {
    pool: PgPool,
}

impl ShiftRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<Shift>, sqlx::Error> {
        query_as!(Shift, "SELECT * FROM shift WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn create(&self, shift: &Shift) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO shift (id, event_id, start_at, end_at) VALUES ($1, $2, $3, $4)",
            shift.id,
            shift.event_id,
            shift.start_at,
            shift.end_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, shift: &Shift) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE shift SET event_id = $2, start_at = $3, end_at = $4 WHERE id = $1",
            shift.id,
            shift.event_id,
            shift.start_at,
            shift.end_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM shift WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
