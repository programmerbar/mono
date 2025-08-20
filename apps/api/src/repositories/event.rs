use crate::models::event::Event;
use sqlx::{PgPool, query, query_as};

pub struct EventRepository {
    pool: PgPool,
}

impl EventRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<Event>, sqlx::Error> {
        query_as!(Event, "SELECT * FROM event WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn create(&self, event: &Event) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO event (id, name, date) VALUES ($1, $2, $3)",
            event.id,
            event.name,
            event.date
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, event: &Event) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE event SET name = $2, date = $3 WHERE id = $1",
            event.id,
            event.name,
            event.date
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM event WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
