import { dev } from '$app/environment';
import { getFeideUser } from '$lib/auth/providers/feide';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';
import { invitations, users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

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
	const existingUser = await locals.db.query.users.findFirst({
		where: (row, { eq }) => eq(row.feideId, feideUser.id)
	});

	if (existingUser) {
		const session = await locals.auth.createSession(existingUser.id, {});
		const sessionCookie = locals.auth.createSessionCookie(session.id);
		cookies.set(locals.auth.sessionCookieName, sessionCookie.value, {
			...sessionCookie.attributes,
			path: '/',
			httpOnly: true,
			secure: !dev
		});

		return new Response(null, {
			status: 302,
			headers: {
				location: '/'
			}
		});
	}

	const invitation = await locals.db.query.invitations.findFirst({
		where: (row, { and, eq, gte }) =>
			and(eq(row.email, feideUser.email), gte(row.expiresAt, new Date()))
	});

	if (!invitation) {
		return new Response('No invitation found', {
			status: 403
		});
	}

	if (invitation.usedAt !== null) {
		return new Response('Invitation already used', {
			status: 403
		});
	}

	await locals.db
		.update(invitations)
		.set({
			usedAt: new Date()
		})
		.where(eq(invitations.id, invitation.id));

	const userId = nanoid();
	await locals.db.insert(users).values({
		id: userId,
		name: feideUser.username,
		email: feideUser.email,
		feideId: feideUser.id
	});

	const session = await locals.auth.createSession(userId, {});
	const sessionCookie = locals.auth.createSessionCookie(session.id);
	cookies.set(locals.auth.sessionCookieName, sessionCookie.value, {
		...sessionCookie.attributes,
		path: '/',
		httpOnly: true,
		secure: !dev
	});

	return new Response(null, {
		status: 302,
		headers: {
			location: '/portal'
		}
	});
};
