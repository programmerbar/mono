use crate::models::product::Product;
use sqlx::{PgPool, query, query_as};

pub struct ProductRepository {
    pool: PgPool,
}

impl ProductRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn list(&self) -> Result<Vec<Product>, sqlx::Error> {
        query_as!(Product, "SELECT * FROM product")
            .fetch_all(&self.pool)
            .await
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<Product>, sqlx::Error> {
        query_as!(Product, "SELECT * FROM product WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn create(&self, product: &Product) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO product (id, sku, name, description, is_sold_out, ordinary_price, student_price, internal_price, credits, volume, alcohol_content, variants, image_id, producer_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)",
            product.id,
            product.sku,
            product.name,
            product.description,
            product.is_sold_out,
            product.ordinary_price,
            product.student_price,
            product.internal_price,
            product.credits,
            product.volume,
            product.alcohol_content,
            product.variants,
            product.image_id,
            product.producer_id,
            product.created_at,
            product.updated_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, product: &Product) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE product SET sku = $2, name = $3, description = $4, is_sold_out = $5, ordinary_price = $6, student_price = $7, internal_price = $8, credits = $9, volume = $10, alcohol_content = $11, variants = $12, image_id = $13, producer_id = $14, created_at = $15, updated_at = $16 WHERE id = $1",
            product.id,
            product.sku,
            product.name,
            product.description,
            product.is_sold_out,
            product.ordinary_price,
            product.student_price,
            product.internal_price,
            product.credits,
            product.volume,
            product.alcohol_content,
            product.variants,
            product.image_id,
            product.producer_id,
            product.created_at,
            product.updated_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM product WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
