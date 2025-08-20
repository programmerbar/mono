use crate::models::product_product_type::ProductProductType;
use sqlx::{PgPool, query, query_as};

pub struct ProductProductTypeRepository {
    pool: PgPool,
}

impl ProductProductTypeRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(
        &self,
        product_id: &str,
        product_type_id: &str,
    ) -> Result<Option<ProductProductType>, sqlx::Error> {
        query_as!(
            ProductProductType,
            "SELECT * FROM product_product_types WHERE product_id = $1 AND product_type_id = $2",
            product_id,
            product_type_id
        )
        .fetch_optional(&self.pool)
        .await
    }

    pub async fn create(
        &self,
        product_product_type: &ProductProductType,
    ) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO product_product_types (product_id, product_type_id) VALUES ($1, $2)",
            product_product_type.product_id,
            product_product_type.product_type_id
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, product_id: &str, product_type_id: &str) -> Result<(), sqlx::Error> {
        query!(
            "DELETE FROM product_product_types WHERE product_id = $1 AND product_type_id = $2",
            product_id,
            product_type_id
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}
