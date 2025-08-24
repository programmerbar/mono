use redis::{Client as RedisClient, Commands, RedisResult};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

const STATUS_KEY: &str = "bar_status";
const TIMESTAMP_KEY: &str = "bar_status_updated";

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[repr(isize)]
pub enum Status {
    #[serde(rename = "open")]
    Open = 0,
    #[serde(rename = "closed")]
    Closed = 1,
    #[serde(rename = "private")]
    Private = 2,
}

impl Status {
    /// Get a human-readable description in Norwegian
    pub fn description(&self) -> &'static str {
        match self {
            Self::Open => "Baren er åpen!",
            Self::Closed => "Baren er stengt.",
            Self::Private => "Det er privat arrangement.",
        }
    }

    /// Convert from integer value with safe fallback
    pub fn from_value(value: i32) -> Self {
        match value {
            0 => Self::Open,
            1 => Self::Closed,
            2 => Self::Private,
            _ => Self::Closed, // Safe default
        }
    }

    /// Convert to integer value for storage
    pub fn value(&self) -> i32 {
        *self as i32
    }
}

impl TryFrom<i32> for Status {
    type Error = &'static str;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Status::Open),
            1 => Ok(Status::Closed),
            2 => Ok(Status::Private),
            _ => Err("Invalid status value"),
        }
    }
}

impl Default for Status {
    fn default() -> Self {
        Self::Closed
    }
}

#[derive(Clone)]
pub struct StatusService {
    redis: Arc<RedisClient>,
}

impl StatusService {
    pub fn new(redis: Arc<RedisClient>) -> Self {
        Self { redis }
    }

    /// Get the current bar status
    pub fn get_status(&self) -> RedisResult<Status> {
        let mut conn = self.redis.get_connection()?;
        let value: i32 = conn.get(STATUS_KEY).unwrap_or_default();
        Ok(Status::from_value(value))
    }

    /// Set the bar status with automatic timestamp tracking
    pub fn set_status(&self, status: Status) -> RedisResult<()> {
        let mut conn = self.redis.get_connection()?;

        // Use pipeline for atomic operations
        let mut pipe = redis::pipe();
        pipe.set(STATUS_KEY, status as isize)
            .set(TIMESTAMP_KEY, chrono::Utc::now().timestamp());

        let _: () = pipe.query(&mut conn)?;
        Ok(())
    }

    /// Get when the status was last updated
    pub fn get_last_updated(&self) -> RedisResult<Option<chrono::DateTime<chrono::Utc>>> {
        let mut conn = self.redis.get_connection()?;
        let timestamp: Option<i64> = conn.get(TIMESTAMP_KEY)?;

        Ok(timestamp.and_then(|ts| chrono::DateTime::from_timestamp(ts, 0)))
    }

    // Convenience setters
    pub fn set_open(&self) -> RedisResult<()> {
        self.set_status(Status::Open)
    }

    pub fn set_closed(&self) -> RedisResult<()> {
        self.set_status(Status::Closed)
    }

    pub fn set_private(&self) -> RedisResult<()> {
        self.set_status(Status::Private)
    }
}
