#![allow(dead_code)]

use crate::models::{session::Session, user::User};

pub struct AuthorizedBoardMember {
    pub session: Session,
    pub user: User,
}

pub struct AuthorizedMember {
    pub session: Session,
    pub user: User,
}
