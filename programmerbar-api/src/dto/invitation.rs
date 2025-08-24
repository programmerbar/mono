use serde::{Deserialize, Serialize};
use serde_email::Email;
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema, Clone, Debug)]
pub struct NewInvitationInput {
    /// The email address to which the invitation will be sent
    #[schema(value_type = String, format = "email")]
    pub email: Email,
}
