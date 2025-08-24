use crate::services::{shift::ShiftService, user::UserService};

#[derive(Clone)]
pub struct BeerService {
    pool: sqlx::PgPool,
    user_service: UserService,
    shift_service: ShiftService,
}

impl BeerService {
    pub fn new(pool: sqlx::PgPool) -> Self {
        let user_service = UserService::new(pool.clone());
        let shift_service = ShiftService::new(pool.clone());

        Self {
            pool,
            user_service,
            shift_service,
        }
    }

    /// Get the amount of unclaimed beers a user has
    pub async fn get_credits(&self, user_id: &str) -> Result<i64, sqlx::Error> {
        let uncalimed_shifts = self
            .shift_service
            .get_unclaimed_shifts_count(user_id)
            .await?;

        let additional_beers = sqlx::query_scalar!(
            r#"
            SELECT additional_beers
            FROM "user"
            WHERE id = $1
            "#,
            user_id
        )
        .fetch_one(&self.pool)
        .await?;

        let total_unclaimed_beers = uncalimed_shifts + additional_beers as i64;

        Ok(total_unclaimed_beers)
    }

    /// Claim a beer for a user
    pub async fn claim_beer(&self, user_id: &str, cost: i32) -> Result<(), String> {
        // Get the available credits for the user
        let unclaimed_shifts = self
            .shift_service
            .get_unclaimed_shifts(user_id)
            .await
            .map_err(|_| "Failed to retrieve unclaimed shifts".to_string())?;

        let user = self
            .user_service
            .find_active_by_id(user_id)
            .await
            .map_err(|_| "Failed to retrieve user".to_string())?;

        let available_credits = unclaimed_shifts.len() as i64 + user.additional_beers as i64;

        // Check if the user has enough credits to claim the beer
        if available_credits < cost as i64 {
            return Err("Not enough credits to claim beer".to_string());
        }

        let mut credits_remaning = cost as i64;

        let shifts_to_claim = unclaimed_shifts.len().min(credits_remaning as usize);

        // Claim the shifts first
        let shifts_to_claim = unclaimed_shifts
            .into_iter()
            .take(shifts_to_claim)
            .map(|shift| shift.id)
            .collect::<Vec<_>>();

        self.shift_service
            .claim_shifts(user_id, &shifts_to_claim)
            .await
            .map_err(|_| "Failed to claim shifts".to_string())?;

        credits_remaning -= shifts_to_claim.len() as i64;

        // If there are still credits remaining, we need to update the user's additional beers
        if credits_remaning > 0 {
            let new_additional_beers = user.additional_beers - credits_remaning as i32;

            self.user_service
                .set_available_beers(user_id, new_additional_beers)
                .await
                .map_err(|_| "Failed to update user's additional beers".to_string())?;
        }

        // TODO: Send notification to all board members

        Ok(())
    }
}
