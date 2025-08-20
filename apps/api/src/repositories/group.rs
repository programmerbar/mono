use crate::models::group::Group;
use sqlx::{PgPool, query_as};

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
}
