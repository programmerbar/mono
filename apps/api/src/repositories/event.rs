use crate::{dto::event::EventWithShifts, models::event::Event};
use sqlx::{FromRow, PgPool, query, query_as};
use std::collections::HashMap;

pub struct EventRepository {
    pool: PgPool,
}

impl EventRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn all(&self) -> Result<Vec<Event>, sqlx::Error> {
        query_as!(Event, "SELECT * FROM event")
            .fetch_all(&self.pool)
            .await
    }

    pub async fn get_by_id(&self, id: &str) -> Result<Option<Event>, sqlx::Error> {
        query_as!(Event, "SELECT * FROM event WHERE id = $1", id)
            .fetch_optional(&self.pool)
            .await
    }

    pub async fn create(&self, event: &Event) -> Result<(), sqlx::Error> {
        query!(
            "INSERT INTO event (id, name, date) VALUES ($1, $2, $3)",
            event.id,
            event.name,
            event.date
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update(&self, event: &Event) -> Result<(), sqlx::Error> {
        query!(
            "UPDATE event SET name = $2, date = $3 WHERE id = $1",
            event.id,
            event.name,
            event.date
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        query!("DELETE FROM event WHERE id = $1", id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    pub async fn all_with_shifts(&self) -> Result<Vec<EventWithShifts>, sqlx::Error> {
        #[derive(FromRow)]
        struct EventShiftUserRow {
            event_id: String,
            event_name: String,
            event_date: chrono::DateTime<chrono::Utc>,
            shift_id: Option<String>,
            shift_start_at: Option<chrono::DateTime<chrono::Utc>>,
            shift_end_at: Option<chrono::DateTime<chrono::Utc>>,
            user_id: Option<String>,
            user_name: Option<String>,
            user_email: Option<String>,
        }

        let rows = query_as!(
            EventShiftUserRow,
            r#"
            SELECT
                e.id as event_id,
                e.name as event_name,
                e.date as event_date,
                s.id as shift_id,
                s.start_at as shift_start_at,
                s.end_at as shift_end_at,
                u.id as user_id,
                u.name as user_name,
                u.email as user_email
            FROM event e
            LEFT JOIN shift s ON e.id = s.event_id
            LEFT JOIN user_shift us ON s.id = us.shift_id
            LEFT JOIN "user" u ON us.user_id = u.id AND u.is_deleted = false
            ORDER BY e.date DESC, s.start_at ASC, u.name ASC
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        // Group the results by event and shift
        let mut events_map: HashMap<String, EventWithShifts> = HashMap::new();

        for row in rows {
            let event = events_map
                .entry(row.event_id.clone())
                .or_insert_with(|| EventWithShifts {
                    id: row.event_id.clone(),
                    name: row.event_name.clone(),
                    date: row.event_date,
                    shifts: vec![],
                });

            if let Some(shift_id) = row.shift_id {
                if let Some(shift) = event.shifts.iter_mut().find(|s| s.id == shift_id) {
                    if let (Some(user_id), Some(user_name), Some(user_email)) =
                        (row.user_id, row.user_name, row.user_email)
                    {
                        shift.users.push(crate::dto::event::User {
                            id: user_id,
                            name: user_name,
                            email: user_email,
                        });
                    }
                } else {
                    let mut new_shift = crate::dto::event::Shift {
                        id: shift_id,
                        start_at: row.shift_start_at.unwrap(),
                        end_at: row.shift_end_at.unwrap(),
                        users: vec![],
                    };

                    if let (Some(user_id), Some(user_name), Some(user_email)) =
                        (row.user_id, row.user_name, row.user_email)
                    {
                        new_shift.users.push(crate::dto::event::User {
                            id: user_id,
                            name: user_name,
                            email: user_email,
                        });
                    }

                    event.shifts.push(new_shift);
                }
            }
        }

        let mut events: Vec<EventWithShifts> = events_map.into_values().collect();
        events.sort_by(|a, b| b.date.cmp(&a.date)); // Most recent first

        Ok(events)
    }
}
