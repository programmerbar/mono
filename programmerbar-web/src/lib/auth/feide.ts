import { OAuth2Client } from 'arctic';

const AUTHORIZATION_ENDPOINT = 'https://auth.dataporten.no/oauth/authorization';
const TOKEN_ENDPOINT = 'https://auth.dataporten.no/oauth/token';
const USERINFO_ENDPOINT = 'https://auth.dataporten.no/openid/userinfo';

export type ProviderUser = {
	id: string;
	username: string;
	email: string;
};

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

export class FeideProvider {
	#client: OAuth2Client;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.#client = new OAuth2Client(clientId, clientSecret, redirectURI);
	}

	createAuthorizationURL(state: string) {
		return this.#client.createAuthorizationURL(AUTHORIZATION_ENDPOINT, state, []);
	}

	validateAuthorizationCode(code: string) {
		return this.#client.validateAuthorizationCode(TOKEN_ENDPOINT, code, null);
	}
}

export async function getFeideUser(accessToken: string): Promise<ProviderUser> {
	const feideUser = await fetch(USERINFO_ENDPOINT, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	}).then((r) => r.json() as Promise<FeideUser>);

	return {
		id: feideUser.sub,
		username: feideUser.name,
		email: feideUser.email.toLowerCase()
	};
}
