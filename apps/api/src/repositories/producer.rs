use crate::models::producer::Producer;
use sqlx::{PgPool, query, query_as};

pub struct ProducerRepository {
    pool: PgPool,
}

impl ProducerRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<Producer>, sqlx::Error> {
        query_as!(Producer, "SELECT * FROM producer WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn create(&self, producer: &Producer) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO producer (id, name, image_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
            producer.id,
            producer.name,
            producer.image_id,
            producer.created_at,
            producer.updated_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, producer: &Producer) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE producer SET name = $2, image_id = $3, created_at = $4, updated_at = $5 WHERE id = $1",
            producer.id,
            producer.name,
            producer.image_id,
            producer.created_at,
            producer.updated_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM producer WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
