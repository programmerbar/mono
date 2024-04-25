import { dev } from '$app/environment';
import { generateState } from 'arctic';

export const GET = async ({ locals, cookies }) => {
	const state = generateState();
	const url = await locals.feide.createAuthorizationURL(state, {
		scopes: ['email', 'openid', 'profile']
	});

	cookies.set('oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		path: '/'
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};
