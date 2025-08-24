use crate::{dto::UpdateUserInput, errors::ApiError, models::user::User};

#[derive(Clone)]
pub struct UserService {
    pool: sqlx::PgPool,
}

impl UserService {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self { pool }
    }

    pub async fn find_active_by_id(&self, user_id: &str) -> Result<User, ApiError> {
        sqlx::query_as!(
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
        sqlx::query_as!(
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
        sqlx::query_as!(
            User,
            "SELECT id, name, email, feide_id, role, additional_beers, alt_email, is_deleted
             FROM \"user\" WHERE is_deleted = false"
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)
    }

    pub async fn update(&self, id: &str, partial_user: &UpdateUserInput) -> Result<User, ApiError> {
        let mut query = String::from("UPDATE \"user\" SET ");
        let mut params = Vec::new();
        let mut set_clauses = Vec::new();
        let mut index = 1;
        if let Some(alt_email) = &partial_user.alt_email {
            set_clauses.push(format!("alt_email = ${index}"));
            params.push(alt_email.as_str());
            index += 1;
        }
        if let Some(phone) = &partial_user.phone {
            set_clauses.push(format!("phone = ${phone}"));
            params.push(phone);
            index += 1;
        }

        query.push_str(&set_clauses.join(", "));
        query.push_str(" WHERE id = $");
        query.push_str(&index.to_string());
        params.push(id);

        sqlx::query(&query).bind(params).execute(&self.pool).await?;

        let updated_user = sqlx::query_as!(
            User,
            "SELECT id, name, email, feide_id, role, additional_beers, alt_email, is_deleted
             FROM \"user\" WHERE id = $1",
            id
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(updated_user)
    }

    /// Set the available beers for a user
    pub async fn set_available_beers(
        &self,
        user_id: &str,
        additional_beers: i32,
    ) -> Result<(), ApiError> {
        sqlx::query!(
            "UPDATE \"user\" SET additional_beers = $1 WHERE id = $2",
            additional_beers,
            user_id
        )
        .execute(&self.pool)
        .await
        .map_err(|_| ApiError::InternalServerError)?;

        Ok(())
    }
}
