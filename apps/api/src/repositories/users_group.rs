use crate::models::users_group::UsersGroup;
use sqlx::{PgPool, query, query_as};

pub struct UsersGroupRepository {
    pool: PgPool,
}

impl UsersGroupRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(
        &self,
        user_id: &str,
        group_id: &str,
    ) -> Result<Option<UsersGroup>, sqlx::Error> {
        query_as!(
            UsersGroup,
            "SELECT * FROM users_groups WHERE user_id = $1 AND group_id = $2",
            user_id,
            group_id
        )
        .fetch_optional(&self.pool)
        .await
    }

    pub async fn create(&self, users_group: &UsersGroup) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO users_groups (user_id, group_id) VALUES ($1, $2)",
            users_group.user_id,
            users_group.group_id
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, user_id: &str, group_id: &str) -> Result<(), sqlx::Error> {
        query!(
            "DELETE FROM users_groups WHERE user_id = $1 AND group_id = $2",
            user_id,
            group_id
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}
