import { dev } from '$app/environment';
import { createAuth } from '$lib/auth/lucia';
import { createFeideProvider } from '$lib/auth/providers/feide';
import { createDatabase } from '$lib/db/drizzle';
import { BanService } from '$lib/services/ban.service';
import { BeerService } from '$lib/services/beer.service';
import { ContactSubmissionService } from '$lib/services/contact-submission.service';
import { EmailService } from '$lib/services/email.service';
import { EventService } from '$lib/services/event.service';
import { GroupsService } from '$lib/services/groups.service';
import { InvitationService } from '$lib/services/invitation.service';
import { NotificationService } from '$lib/services/notification.service';
import { ProducerService } from '$lib/services/producer.service';
import { ProductService } from '$lib/services/product.service';
import { ProductTypeService } from '$lib/services/product-type.service';
import { ShiftService } from '$lib/services/shift.service';
import { StatusService } from '$lib/services/status.service';
import { UserService } from '$lib/services/user.service';
import type { Handle } from '@sveltejs/kit';
import { Resend } from 'resend';
import { ImageService } from '$lib/services/image.service';
import { ReferralService } from '$lib/services/referral.service';

export const handle: Handle = async ({ event, resolve }) => {
	const STATUS_KV = event.platform!.env.STATUS_KV;
	const R2_BUCKET = event.platform!.env.BUCKET;
	const DB = event.platform!.env.DB;

	const banService = new BanService(STATUS_KV);
	event.locals.banService = banService;

	const ip = event.getClientAddress();
	const isIpBanned = await banService.isIpBanned(ip);

	if (isIpBanned) {
		return new Response(null, {
			status: 429,
			headers: {
				'retry-after': '3600'
			}
		});
	}

	// Setup Resend
	const resend = new Resend(event.platform?.env.RESEND_API_KEY);
	event.locals.resend = resend;

	// Setup database
	const db = createDatabase(DB);
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

	const beerService = new BeerService(db, shiftService);
	event.locals.beerService = beerService;

	const notificationService = new NotificationService(db);
	event.locals.notificationService = notificationService;

	const groupsService = new GroupsService(db);
	event.locals.groupsService = groupsService;

	const contactSubmissionService = new ContactSubmissionService(db);
	event.locals.contactSubmissionService = contactSubmissionService;

	const producerService = new ProducerService(db);
	event.locals.producerService = producerService;

	const productTypeService = new ProductTypeService(db);
	event.locals.productTypeService = productTypeService;

	const productService = new ProductService(db);
	event.locals.productService = productService;

	const imageService = new ImageService(R2_BUCKET, db);
	event.locals.imageService = imageService;

	const referralService = new ReferralService(db);
	event.locals.referralService = referralService;

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

	if (event.url.pathname.startsWith('/portal/admin') && event.locals.user?.role !== 'board') {
		return new Response(null, {
			status: 307,
			headers: {
				location: '/logg-inn'
			}
		});
	}

	if (event.url.pathname.startsWith('/portal') && !event.locals.user) {
		return new Response(null, {
			status: 307,
			headers: {
				location: '/logg-inn'
			}
		});
	}

	return await resolve(event);
};
