import {
	COOKIE_NAME_FEIDE_OAUTH_STATE,
	COOKIE_NAME_FROM,
	COOKIE_VALUE_BLI_FRIVILLIG
} from '$lib/constants';
import { generateState } from 'arctic';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals, cookies }) => {
	const state = generateState();
	const url = locals.feideProvider.createAuthorizationURL(state);

	cookies.set(COOKIE_NAME_FEIDE_OAUTH_STATE, state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10
	});

	cookies.set(COOKIE_NAME_FROM, COOKIE_VALUE_BLI_FRIVILLIG, {
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
