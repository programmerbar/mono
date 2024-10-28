import { dev } from '$app/environment';
import { createAuth } from '$lib/auth/lucia';
import { createFeideProvider } from '$lib/auth/providers/feide';
import { createDatabase } from '$lib/db/drizzle';
import { EmailService } from '$lib/services/email.service';
import { EventService } from '$lib/services/event.service';
import { InvitationService } from '$lib/services/invitation.service';
import { ShiftService } from '$lib/services/shift.service';
import { StatusService } from '$lib/services/status.service';
import { UserService } from '$lib/services/user.service';
import type { Handle } from '@sveltejs/kit';
import { Resend } from 'resend';

export const handle: Handle = async ({ event, resolve }) => {
	// Setup Resend
	const resend = new Resend(event.platform?.env.RESEND_API_KEY);
	event.locals.resend = resend;

	// Setup database
	const db = createDatabase(event.platform!.env.DB);
	event.locals.db = db;

	// Setup auth
	const auth = createAuth(db);
	event.locals.auth = auth;

	// Setup feide provider
	const feideProvider = createFeideProvider(
		event.platform!.env.FEIDE_CLIENT_ID,
		event.platform!.env.FEIDE_CLIENT_SECRET,
		event.platform!.env.FEIDE_REDIRECT_URI
	);
	event.locals.feideProvider = feideProvider;

	// Setup status service
	const statusService = new StatusService(event.platform!.env.STATUS_KV);
	event.locals.statusService = statusService;

	const invitationService = new InvitationService(db);
	event.locals.invitationService = invitationService;

	const userService = new UserService(db);
	event.locals.userService = userService;

	const eventService = new EventService(db);
	event.locals.eventService = eventService;

	const emailService = new EmailService(resend);
	event.locals.emailService = emailService;

	const shiftService = new ShiftService(db);
	event.locals.shiftService = shiftService;

	// Validate auth
	const sessionId = event.cookies.get(auth.sessionCookieName);

	if (sessionId) {
		const { session, user } = await auth.validateSession(sessionId);

		event.locals.user = user;
		event.locals.session = session;
	} else {
		event.locals.user = null;
		event.locals.session = null;
	}

	if (!event.locals.user) {
		event.cookies.delete(auth.sessionCookieName, {
			path: '/',
			httpOnly: true,
			secure: !dev
		});
	}

	// Protect /portal/* from unauthenticated users
	if (event.url.pathname.startsWith('/portal') && !event.locals.user) {
		return new Response(null, {
			status: 307,
			headers: {
				location: '/logg-inn'
			}
		});
	}

	return resolve(event);
};
