use crate::models::group::Group;
use sqlx::{PgPool, query, query_as};

pub struct GroupRepository {
    pool: PgPool,
}

impl GroupRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<Group>, sqlx::Error> {
        query_as!(Group, "SELECT * FROM \"group\" WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn create(&self, group: &Group) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO \"group\" (id, name, description) VALUES ($1, $2, $3)",
            group.id,
            group.name,
            group.description,
        );
        Ok(())
    }

    pub async fn update(&self, group: &Group) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE \"group\" SET name = $2, description = $3 WHERE id = $1",
            group.id,
            group.name,
            group.description,
        );
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM \"group\" WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
