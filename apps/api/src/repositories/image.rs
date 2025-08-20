use crate::models::image::Image;
use sqlx::{PgPool, query, query_as};

pub struct ImageRepository {
    pool: PgPool,
}

impl ImageRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<Image>, sqlx::Error> {
        query_as!(Image, "SELECT * FROM image WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn create(&self, image: &Image) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO image (id, filename, size, type, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
            image.id,
            image.filename,
            image.size,
            image.r#type,
            image.created_at,
            image.updated_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, image: &Image) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE image SET filename = $2, size = $3, type = $4, created_at = $5, updated_at = $6 WHERE id = $1",
            image.id,
            image.filename,
            image.size,
            image.r#type,
            image.created_at,
            image.updated_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM image WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
