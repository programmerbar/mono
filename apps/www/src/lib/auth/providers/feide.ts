import type { OAuth2Tokens } from './oauth2';
import { createOAuth2Request, encodeBasicCredentials, sendTokenRequest } from './requests';
import { type ProviderUser } from './types';

const baseFeideUrl = 'https://auth.dataporten.no';
const authorizationEndpoint = `${baseFeideUrl}/oauth/authorization`;
const tokenEndpoint = `${baseFeideUrl}/oauth/token`;
const userinfoEndpoint = `${baseFeideUrl}/openid/userinfo`;

export class Feide {
	#clientId: string;
	#clientSecret: string;
	#redirectURI: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.#clientId = clientId;
		this.#clientSecret = clientSecret;
		this.#redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string, scopes: string[]): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set('response_type', 'code');
		url.searchParams.set('client_id', this.#clientId);
		url.searchParams.set('state', state);
		url.searchParams.set('scope', scopes.join(' '));
		url.searchParams.set('redirect_uri', this.#redirectURI);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set('grant_type', 'authorization_code');
		body.set('code', code);
		body.set('redirect_uri', this.#redirectURI);

		const request = createOAuth2Request(tokenEndpoint, body);
		const encodedCredentials = encodeBasicCredentials(this.#clientId, this.#clientSecret);
		request.headers.set('Authorization', `Basic ${encodedCredentials}`);
		const tokens = await sendTokenRequest(request);

		return tokens;
	}
}

export type FeideUser = {
	aud: string;
	sub: string;
	'connect-userid_sec': Array<string>;
	'dataporten-userid_sec': Array<string>;
	'https://n.feide.no/claims/userid_sec': Array<string>;
	name: string;
	email: string;
	email_verified: boolean;
};

export const createFeideProvider = (
	feideClientId: string,
	feideClientSecret: string,
	feideRedirectUri: string
) => {
	return new Feide(feideClientId, feideClientSecret, feideRedirectUri);
};

export const getFeideUser = async (accessToken: string): Promise<ProviderUser> => {
	const feideUser = await fetch(userinfoEndpoint, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	}).then((r) => r.json() as Promise<FeideUser>);

	return {
		id: feideUser.sub,
		username: feideUser.name,
		email: feideUser.email
	};
};
