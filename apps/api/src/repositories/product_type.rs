use crate::models::product_type::ProductType;
use sqlx::{PgPool, query, query_as};

pub struct ProductTypeRepository {
    pool: PgPool,
}

impl ProductTypeRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<ProductType>, sqlx::Error> {
        query_as!(ProductType, "SELECT * FROM product_type WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn create(&self, product_type: &ProductType) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO product_type (id, title, created_at, updated_at) VALUES ($1, $2, $3, $4)",
            product_type.id,
            product_type.title,
            product_type.created_at,
            product_type.updated_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, product_type: &ProductType) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE product_type SET title = $2, created_at = $3, updated_at = $4 WHERE id = $1",
            product_type.id,
            product_type.title,
            product_type.created_at,
            product_type.updated_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM product_type WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
