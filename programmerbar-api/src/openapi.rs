use utoipa::{
    Modify, OpenApi,
    openapi::{
        Server,
        security::{ApiKey, ApiKeyValue, HttpAuthScheme, HttpBuilder, SecurityScheme},
    },
};

use crate::services::session::SESSION_COOKIE_NAME;

#[derive(OpenApi)]
#[openapi(
    modifiers(&SecurityAddon, &ServerAddon),
    tags(
        (name = "Health", description = "Health check endpoints"),
        (name = "Products", description = "Product management"),
        (name = "Events", description = "Event and shift management"),
        (name = "Authentication", description = "User authentication via Feide"),
        (name = "Images", description = "Image upload and retrieval"),
        (name = "Status", description = "Status of the bar"),
        (name = "Admin", description = "Admin endpoints for BFF operations"),
        (name = "Users", description = "User management endpoints"),
        (name = "Invitations", description = "Invitation management endpoints")
    )
)]
pub struct ApiDoc;

struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "session",
                SecurityScheme::ApiKey(ApiKey::Cookie(ApiKeyValue::new(SESSION_COOKIE_NAME))),
            );
            components.add_security_scheme(
                "admin_key",
                SecurityScheme::Http(HttpBuilder::new().scheme(HttpAuthScheme::Bearer).build()),
            );
        }
    }
}

struct ServerAddon;

impl Modify for ServerAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        openapi.servers = Some(vec![Server::new("/"), Server::new("srv.programmer.bar")])
    }
}
