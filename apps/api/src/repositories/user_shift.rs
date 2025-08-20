use crate::models::user_shift::UserShift;
use sqlx::{PgPool, query, query_as};

pub struct UserShiftRepository {
    pool: PgPool,
}

impl UserShiftRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(
        &self,
        user_id: &str,
        shift_id: &str,
    ) -> Result<Option<UserShift>, sqlx::Error> {
        query_as!(
            UserShift,
            "SELECT * FROM user_shift WHERE user_id = $1 AND shift_id = $2",
            user_id,
            shift_id
        )
        .fetch_optional(&self.pool)
        .await
    }

    pub async fn create(&self, user_shift: &UserShift) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO user_shift (user_id, shift_id, created_at, updated_at, is_beer_claimed, status) VALUES ($1, $2, $3, $4, $5, $6)",
            user_shift.user_id,
            user_shift.shift_id,
            user_shift.created_at,
            user_shift.updated_at,
            user_shift.is_beer_claimed,
            user_shift.status
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, user_shift: &UserShift) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE user_shift SET created_at = $3, updated_at = $4, is_beer_claimed = $5, status = $6 WHERE user_id = $1 AND shift_id = $2",
            user_shift.user_id,
            user_shift.shift_id,
            user_shift.created_at,
            user_shift.updated_at,
            user_shift.is_beer_claimed,
            user_shift.status
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, user_id: &str, shift_id: &str) -> Result<(), sqlx::Error> {
        query!(
            "DELETE FROM user_shift WHERE user_id = $1 AND shift_id = $2",
            user_id,
            shift_id
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}
