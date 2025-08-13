import { generateState } from '$lib/auth/providers/oauth2';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals, cookies }) => {
	const state = generateState();
	const url = locals.feideProvider.createAuthorizationURL(state, []);

	cookies.set('feide_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10
	});

	cookies.set('from', 'bli-frivillig', {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10
	});

	return new Response(null, {
		status: 302,
		headers: {
			location: url.toString()
		}
	});
};
