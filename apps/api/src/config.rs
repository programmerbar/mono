#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub server_port: u16,
}

impl Config {
    pub fn from_env() -> Self {
        let database_url = std::env::var("DATABASE_URL")
            .expect("Expected DATABASE_URL environment variable to be set");
        let server_port = std::env::var("SERVER_PORT")
            .unwrap_or_else(|_| "8000".to_string())
            .parse()
            .expect("SERVER_PORT must be a valid u16");

        Config {
            database_url,
            server_port,
        }
    }
}
