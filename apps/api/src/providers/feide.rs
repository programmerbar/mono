use oauth2::{ClientId, ClientSecret, CsrfToken, RedirectUrl};
use reqwest;
use serde::{Deserialize, Serialize};

const FEIDE_AUTHORIZATION_ENDPOINT: &str = "https://auth.dataporten.no/oauth/authorization";
const FEIDE_TOKEN_ENDPOINT: &str = "https://auth.dataporten.no/oauth/token";
const FEIDE_USERINFO_ENDPOINT: &str = "https://auth.dataporten.no/openid/userinfo";

#[derive(Debug)]
pub struct FeideProvider {
    client_id: ClientId,
    client_secret: ClientSecret,
    redirect_uri: RedirectUrl,
    http_client: reqwest::Client,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FeideUser {
    pub aud: String,
    pub sub: String,
    #[serde(rename = "connect-userid_sec")]
    pub connect_userid_sec: Vec<String>,
    #[serde(rename = "dataporten-userid_sec")]
    pub dataporten_userid_sec: Vec<String>,
    #[serde(rename = "https://n.feide.no/claims/userid_sec")]
    pub feide_userid_sec: Vec<String>,
    pub name: String,
    pub email: String,
    pub email_verified: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    pub access_token: String,
    pub token_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub refresh_token: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_in: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scope: Option<String>,
}

#[derive(Debug, thiserror::Error)]
pub enum FeideError {
    #[error("HTTP request failed: {0}")]
    HttpError(#[from] reqwest::Error),
    #[error("JSON parsing error: {0}")]
    JsonError(#[from] serde_json::Error),
    #[error("OAuth2 token exchange failed: {0}")]
    TokenExchangeError(String),
    #[error("URL parsing error: {0}")]
    UrlParseError(#[from] url::ParseError),
}

impl FeideProvider {
    pub fn new(
        client_id: ClientId,
        client_secret: ClientSecret,
        redirect_uri: RedirectUrl,
    ) -> Self {
        Self {
            client_id,
            client_secret,
            redirect_uri,
            http_client: reqwest::Client::new(),
        }
    }

    pub fn authorization_url_with_state(&self, state: &CsrfToken) -> Result<String, FeideError> {
        let mut url = reqwest::Url::parse(FEIDE_AUTHORIZATION_ENDPOINT)?;
        url.query_pairs_mut()
            .append_pair("response_type", "code")
            .append_pair("client_id", self.client_id.as_str())
            .append_pair("redirect_uri", self.redirect_uri.as_str())
            .append_pair("scope", "")
            .append_pair("state", state.secret());

        Ok(url.to_string())
    }

    pub async fn exchange_code(&self, code: &str) -> Result<TokenResponse, FeideError> {
        let params = [
            ("grant_type", "authorization_code"),
            ("code", code),
            ("redirect_uri", self.redirect_uri.as_str()),
        ];

        let response = self
            .http_client
            .post(FEIDE_TOKEN_ENDPOINT)
            .basic_auth(self.client_id.as_str(), Some(self.client_secret.secret()))
            .form(&params)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(FeideError::TokenExchangeError(error_text));
        }

        let token_response: TokenResponse = response.json().await?;
        Ok(token_response)
    }

    pub async fn get_user_info(&self, access_token: &str) -> Result<FeideUser, FeideError> {
        let response = self
            .http_client
            .get(FEIDE_USERINFO_ENDPOINT)
            .header("Authorization", format!("Bearer {access_token}"))
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(FeideError::TokenExchangeError(format!(
                "Failed to get user info: {error_text}"
            )));
        }

        let user_info: FeideUser = response.json().await?;
        Ok(user_info)
    }
}
