use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct User {
    /// Unique identifier for the user
    pub id: String,
    /// Name of the user
    pub name: String,
    /// Email address of the user
    pub email: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct Shift {
    /// Unique identifier for the shift
    pub id: String,
    /// Start time of the shift
    pub start_at: DateTime<Utc>,
    /// End time of the shift
    pub end_at: DateTime<Utc>,
    /// List of users assigned to this shift
    pub users: Vec<User>,
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct EventWithShifts {
    /// Unique identifier for the event
    pub id: String,
    /// Name of the event
    pub name: String,
    /// Date and time of the event
    pub date: DateTime<Utc>,
    /// List of shifts associated with the event
    pub shifts: Vec<Shift>,
}
