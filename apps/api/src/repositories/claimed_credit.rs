use crate::models::claimed_credit::ClaimedCredit;
use sqlx::{PgPool, query, query_as};

pub struct ClaimedCreditRepository {
    pool: PgPool,
}

impl ClaimedCreditRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<ClaimedCredit>, sqlx::Error> {
        query_as!(
            ClaimedCredit,
            "SELECT * FROM claimed_credit WHERE id = $1",
            id
        )
        .fetch_optional(&self.pool)
        .await
    }

    pub async fn create(&self, claimed_credit: &ClaimedCredit) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO claimed_credit (id, user_id, product_id, credit_cost, created_at) VALUES ($1, $2, $3, $4, $5)",
            claimed_credit.id,
            claimed_credit.user_id,
            claimed_credit.product_id,
            claimed_credit.credit_cost,
            claimed_credit.created_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, claimed_credit: &ClaimedCredit) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE claimed_credit SET user_id = $2, product_id = $3, credit_cost = $4, created_at = $5 WHERE id = $1",
            claimed_credit.id,
            claimed_credit.user_id,
            claimed_credit.product_id,
            claimed_credit.credit_cost,
            claimed_credit.created_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM claimed_credit WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
