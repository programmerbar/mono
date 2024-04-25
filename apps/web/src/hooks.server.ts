import { createAuth } from '$lib/server/auth/lucia';
import { createFeideProvider } from '$lib/server/auth/providers/feide';
import { createDatabase } from '$lib/server/db/drizzle';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { Resend } from 'resend';

const getResendClient = (apiKey: string | null) => {
	if (!apiKey) {
		return null;
	}

	return new Resend(apiKey);
};

const setup: Handle = ({ event, resolve }) => {
	if (!event.platform) return resolve(event);

	event.locals.resend = getResendClient(event.platform?.env.RESEND_API_KEY ?? null);

	const dbBinding = event.platform.env.DB;
	event.locals.db = createDatabase(dbBinding);
	event.locals.lucia = createAuth(dbBinding);

	event.locals.feide =
		createFeideProvider(
			event.platform.env.FEIDE_CLIENT_ID,
			event.platform.env.FEIDE_CLIENT_SECRET
		) ?? null;

	return resolve(event);
};

const auth: Handle = async ({ event, resolve }) => {
	if (!event.platform) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { lucia } = event.locals;

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle = sequence(setup, auth);
