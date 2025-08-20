use oauth2::{ClientId, ClientSecret, RedirectUrl};

#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub server_port: u16,
    pub feide_client_id: ClientId,
    pub feide_client_secret: ClientSecret,
    pub feide_redirect_uri: RedirectUrl,
    pub is_dev: bool,
    pub s3_endpoint: String,
    pub s3_access_key: String,
    pub s3_secret_key: String,
    pub s3_region: String,
    pub s3_bucket: String,
    pub redis_url: String,
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

        let is_dev = std::env::var("IS_DEV").unwrap_or_default() == "true";

        let s3_endpoint = std::env::var("S3_ENDPOINT")
            .unwrap_or_else(|_| "http://localhost:9000".to_string());
        let s3_access_key = std::env::var("S3_ACCESS_KEY")
            .unwrap_or_else(|_| "minioadmin".to_string());
        let s3_secret_key = std::env::var("S3_SECRET_KEY")
            .unwrap_or_else(|_| "minioadmin".to_string());
        let s3_region = std::env::var("S3_REGION")
            .unwrap_or_else(|_| "us-east-1".to_string());
        let s3_bucket = std::env::var("S3_BUCKET")
            .expect("Expected S3_BUCKET environment variable to be set");

        let redis_url = std::env::var("REDIS_URL")
            .unwrap_or_else(|_| "redis://localhost:6379".to_string());

        Config {
            database_url,
            server_port,
            feide_client_id,
            feide_client_secret,
            feide_redirect_uri,
            is_dev,
            s3_endpoint,
            s3_access_key,
            s3_secret_key,
            s3_region,
            s3_bucket,
            redis_url,
        }
    }
}
