use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Shift {
    pub id: String,
    pub start_at: DateTime<Utc>,
    pub end_at: DateTime<Utc>,
    pub users: Vec<User>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct EventWithShifts {
    pub id: String,
    pub name: String,
    pub date: DateTime<Utc>,
    pub shifts: Vec<Shift>,
}
