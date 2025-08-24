use crate::models::shift::Shift;

#[derive(Clone)]
pub struct ShiftService {
    pool: sqlx::PgPool,
}

impl ShiftService {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self { pool }
    }

    /// The the count of shifts with unclaimed beers for a user
    pub async fn get_unclaimed_shifts_count(&self, user_id: &str) -> Result<i64, sqlx::Error> {
        let count = sqlx::query_scalar!(
            r#"
            SELECT COUNT(*)
            FROM shift
            LEFT JOIN user_shift ON shift.id = user_shift.shift_id
            WHERE user_shift.user_id = $1
              AND user_shift.is_beer_claimed = false
              AND shift.end_at <= NOW()
            "#,
            user_id
        )
        .fetch_one(&self.pool)
        .await?
        .unwrap_or(0);

        Ok(count)
    }

    /// Get the shifts that has unclaimed beers for a user
    pub async fn get_unclaimed_shifts(&self, user_id: &str) -> Result<Vec<Shift>, sqlx::Error> {
        let shifts = sqlx::query_as!(
            Shift,
            r#"
            SELECT shift.*
            FROM shift
            LEFT JOIN user_shift ON shift.id = user_shift.shift_id
            WHERE user_shift.user_id = $1
              AND user_shift.is_beer_claimed = false
              AND shift.end_at <= NOW()
            "#,
            user_id
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(shifts)
    }

    /// Mark shifts as claimed for a user
    pub async fn claim_shifts(
        &self,
        user_id: &str,
        shift_ids: &[String],
    ) -> Result<(), sqlx::Error> {
        if shift_ids.is_empty() {
            return Ok(());
        }

        sqlx::query!(
            r#"
            UPDATE user_shift
            SET is_beer_claimed = true
            WHERE user_id = $1 AND shift_id = ANY($2)
            "#,
            user_id,
            &shift_ids[..]
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}
