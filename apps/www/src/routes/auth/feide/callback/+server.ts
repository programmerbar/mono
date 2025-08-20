import { getFeideUser } from '$lib/auth/providers/feide';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';
import { setSessionCookie } from '$lib/auth/cookies';
import {
	COOKIE_NAME_FEIDE_OAUTH_STATE,
	COOKIE_NAME_FROM,
	ERROR_SEARCH_PARAM_ALREADY_REGISTERED,
	COOKIE_VALUE_BLI_FRIVILLIG,
	COOKIE_NAME_CODE,
	COOKIE_NAME_STATE
} from '$lib/constants';

export const GET: RequestHandler = async ({ locals, cookies, url }) => {
	const state = url.searchParams.get(COOKIE_NAME_STATE);
	const code = url.searchParams.get(COOKIE_NAME_CODE);
	const storedState = cookies.get(COOKIE_NAME_FEIDE_OAUTH_STATE);

	if (!state || !code || !storedState || state !== storedState) {
		return new Response('Invalid state', {
			status: 400
		});
	}

	const tokens = await locals.feideProvider.validateAuthorizationCode(code);
	const feideUser = await getFeideUser(tokens.accessToken());
	const existingUser = await locals.userService.findByFeideId(feideUser.id);

	const from = cookies.get(COOKIE_NAME_FROM);
	if (from === COOKIE_VALUE_BLI_FRIVILLIG) {
		cookies.delete(COOKIE_NAME_FROM, { path: '/' });

		if (existingUser) {
			return new Response(null, {
				status: 302,
				headers: {
					location: `/bli-frivillig?error=${ERROR_SEARCH_PARAM_ALREADY_REGISTERED}`
				}
			});
		}

		const existingApplication = await locals.pendingApplicationService.findByFeideId(feideUser.id);
		if (existingApplication) {
			return new Response(null, {
				status: 302,
				headers: {
					location: `/bli-frivillig?error=${ERROR_SEARCH_PARAM_ALREADY_REGISTERED}`
				}
			});
		}

		await locals.pendingApplicationService.create({
			name: feideUser.username,
			email: feideUser.email,
			feideId: feideUser.id
		});

		await locals.emailService.sendVolunteerRequestEmail({
			name: feideUser.username,
			email: feideUser.email
		});

		return new Response(null, {
			status: 302,
			headers: {
				location: '/bli-frivillig?success=true'
			}
		});
	}

	if (existingUser) {
		const session = await locals.auth.createSession(existingUser.id, {});
		const sessionCookie = locals.auth.createSessionCookie(session.id);
		setSessionCookie(cookies, locals.auth.sessionCookieName, sessionCookie);

		return new Response(null, {
			status: 302,
			headers: {
				location: '/'
			}
		});
	}

	const [invitation, error] = await locals.invitationService.findValidInvitationByEmail(
		feideUser.email.toLowerCase()
	);

	if (error !== null) {
		return new Response(error, {
			status: 403
		});
	}

	await locals.invitationService.claim(invitation.id);

	const userId = nanoid();
	await locals.userService.create({
		id: userId,
		name: feideUser.username,
		email: feideUser.email,
		feideId: feideUser.id
	});

	const session = await locals.auth.createSession(userId, {});
	const sessionCookie = locals.auth.createSessionCookie(session.id);
	setSessionCookie(cookies, locals.auth.sessionCookieName, sessionCookie);

	return new Response(null, {
		status: 302,
		headers: {
			location: '/portal'
		}
	});
};
