// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// Email client
			resend: import('resend').Resend;

			// DB client
			db: import('$lib/db/drizzle').Database;

			// Auth service
			auth: import('$lib/auth/lucia').Auth;

			// Auth
			user: import('lucia').User | null;
			session: import('lucia').Session | null;

			// Auth providers
			feideProvider: import('$lib/auth/providers/feide').Feide;

			// Serivces
			emailService: import('$lib/services/email.service').EmailService;
			statusService: import('$lib/services/status.service').StatusService;
			invitationService: import('$lib/services/invitation.service').InvitationService;
			eventService: import('$lib/services/event.service').EventService;
			userService: import('$lib/services/user.service').UserService;
			shiftService: import('$lib/services/shift.service').ShiftService;
			beerService: import('$lib/services/beer.service').BeerService;
			banService: import('$lib/services/ban.service').BanService;
			notificationService: import('$lib/services/notification.service').NotificationService;
			tagService: import('$lib/services/tag.service').TagService;
			contactSubmissionService: import('$lib/services/contact-submission.service').ContactSubmissionService;
			producerService: import('$lib/services/producer.service').ProducerService;
			productTypeService: import('$lib/services/product-type.service').ProductTypeService;
			productService: import('$lib/services/product.service').ProductService;
			imageService: import('$lib/services/image.service').ImageService;
			referralService: import('$lib/services/referral.service').ReferralService;
			pendingApplicationService: import('$lib/services/pending-application.service').PendingApplicationService;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
