use sqlx::{Pool, Postgres, query_as};

use crate::{errors::ApiError, models::user::User};

#[derive(Clone)]
pub struct UserService {
    pool: Pool<Postgres>,
}

impl UserService {
    pub fn new(pool: Pool<Postgres>) -> Self {
        Self { pool }
    }

    pub async fn find_active_by_id(&self, user_id: &str) -> Result<User, ApiError> {
        query_as!(
            User,
            "SELECT id, name, email, feide_id, role, additional_beers, alt_email, is_deleted
             FROM \"user\" WHERE id = $1 AND is_deleted = false",
            user_id
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|err| match err {
            sqlx::Error::RowNotFound => ApiError::Unauthorized,
            _ => ApiError::InternalServerError,
        })
    }

    pub async fn get_by_feide_id(&self, feide_id: &str) -> Result<Option<User>, ApiError> {
        query_as!(
            User,
            "SELECT id, name, email, feide_id, role, additional_beers, alt_email, is_deleted
             FROM \"user\" WHERE feide_id = $1 AND is_deleted = false",
            feide_id
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)
    }

    pub async fn create(&self, user: &User) -> Result<(), ApiError> {
        sqlx::query!(
            "INSERT INTO \"user\" (id, name, email, feide_id, role, additional_beers, alt_email, is_deleted)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            user.id,
            user.name,
            user.email,
            user.feide_id,
            user.role,
            user.additional_beers,
            user.alt_email,
            user.is_deleted
        )
        .execute(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

        Ok(())
    }

    pub async fn list_active(&self) -> Result<Vec<User>, ApiError> {
        query_as!(
            User,
            "SELECT id, name, email, feide_id, role, additional_beers, alt_email, is_deleted
             FROM \"user\" WHERE is_deleted = false"
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)
    }
}
