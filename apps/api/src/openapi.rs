use utoipa::{
    Modify, OpenApi,
    openapi::security::{ApiKey, ApiKeyValue, HttpAuthScheme, HttpBuilder, SecurityScheme},
};

#[derive(OpenApi)]
#[openapi(
    modifiers(&SecurityAddon),
    tags(
        (name = "General", description = "General API endpoints"),
        (name = "Health", description = "Health check endpoints"),
        (name = "Products", description = "Product management"),
        (name = "Events", description = "Event and shift management"),
        (name = "Authentication", description = "User authentication via Feide"),
        (name = "Profile", description = "User profile management"),
        (name = "Images", description = "Image upload and retrieval"),
        (name = "Status", description = "Status of the bar")
    )
)]
pub struct ApiDoc;

pub struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "session",
                SecurityScheme::ApiKey(ApiKey::Cookie(ApiKeyValue::new("session_token"))),
            );
            components.add_security_scheme(
                "admin_key",
                SecurityScheme::Http(HttpBuilder::new().scheme(HttpAuthScheme::Bearer).build()),
            );
        }
    }
}
