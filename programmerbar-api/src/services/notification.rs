use crate::models::notification::Notification;

#[derive(Clone)]
pub struct NotificationService {
    pub pool: sqlx::PgPool,
}

impl NotificationService {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self { pool }
    }

    /// Get the notifications of a user that are not read
    pub async fn get_unread_notifications(
        &self,
        user_id: &str,
    ) -> Result<Vec<Notification>, sqlx::Error> {
        sqlx::query_as!(
            Notification,
            r#"
            SELECT * FROM notification
            WHERE user_id = $1 AND archived_at IS NULL
            "#,
            user_id
        )
        .fetch_all(&self.pool)
        .await
    }

    /// Archive a notification
    pub async fn archive_notification(
        &self,
        notification_id: &str,
        user_id: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query!(
            r#"
            UPDATE notification
            SET archived_at = NOW()
            WHERE id = $1 AND user_id = $2
            "#,
            notification_id,
            user_id,
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}
