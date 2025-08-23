import { api } from '.';

export type ProfileResponse = {
	additional_beers: number;
	alt_email: string;
	email: string;
	feide_id: string;
	id: string;
	name: string;
	role: string;
};

export async function getUserBySession(sessionId: string) {
	return await api
		.get('profile', {
			headers: {
				Cookie: `auth_session=${sessionId}`
			}
		})
		.json<ProfileResponse>()
		.catch(() => null);
}

export async function logout() {
	return await api
		.post('auth/logout', {
			throwHttpErrors: false
		})
		.then((response) => response.ok);
}
