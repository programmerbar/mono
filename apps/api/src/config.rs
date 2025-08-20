use oauth2::{ClientId, ClientSecret, RedirectUrl};

#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub server_port: u16,
    pub feide_client_id: ClientId,
    pub feide_client_secret: ClientSecret,
    pub feide_redirect_uri: RedirectUrl,
}

impl Config {
    pub fn from_env() -> Self {
        let database_url = std::env::var("DATABASE_URL")
            .expect("Expected DATABASE_URL environment variable to be set");

        let server_port = std::env::var("SERVER_PORT")
            .unwrap_or_else(|_| "8000".to_string())
            .parse()
            .expect("SERVER_PORT must be a valid u16");

        let feide_client_id = ClientId::new(
            std::env::var("FEIDE_CLIENT_ID")
                .expect("Expected FEIDE_CLIENT_ID environment variable to be set"),
        );

        let feide_client_secret = ClientSecret::new(
            std::env::var("FEIDE_CLIENT_SECRET")
                .expect("Expected FEIDE_CLIENT_SECRET environment variable to be set"),
        );

        let feide_redirect_uri = RedirectUrl::new(
            std::env::var("FEIDE_REDIRECT_URI")
                .expect("Expected FEIDE_REDIRECT_URI environment variable to be set"),
        )
        .expect("FEIDE_REDIRECT_URI must be a valid URL");

        Config {
            database_url,
            server_port,
            feide_client_id,
            feide_client_secret,
            feide_redirect_uri,
        }
    }
}
