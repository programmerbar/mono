use crate::models::notification::Notification;
use sqlx::{PgPool, query, query_as};

pub struct NotificationRepository {
    pool: PgPool,
}

impl NotificationRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<Notification>, sqlx::Error> {
        query_as!(Notification, "SELECT * FROM notification WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn create(&self, notification: &Notification) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO notification (id, user_id, title, body, archived_at, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
            notification.id,
            notification.user_id,
            notification.title,
            notification.body,
            notification.archived_at,
            notification.created_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, notification: &Notification) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE notification SET user_id = $2, title = $3, body = $4, archived_at = $5, created_at = $6 WHERE id = $1",
            notification.id,
            notification.user_id,
            notification.title,
            notification.body,
            notification.archived_at,
            notification.created_at
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM notification WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
