import { getFeideUser } from '$lib/auth/providers/feide';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';
import { setSessionCookie } from '$lib/auth/cookies';

export const GET: RequestHandler = async ({ locals, cookies, url }) => {
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	const storedState = cookies.get('feide_oauth_state');

	if (!state || !code || !storedState || state !== storedState) {
		return new Response('Invalid state', {
			status: 400
		});
	}

	const tokens = await locals.feideProvider.validateAuthorizationCode(code);
	const feideUser = await getFeideUser(tokens.accessToken());
	const existingUser = await locals.userService.findByFeideId(feideUser.id);

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
