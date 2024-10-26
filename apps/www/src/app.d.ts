// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			resend: import('resend').Resend;
			db: import('$lib/db/drizzle').Database;
			auth: import('$lib/auth/lucia').Auth;
			statusService: import('$lib/services/status.service').StatusService;
			feideProvider: import('$lib/auth/providers/feide').Feide;
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
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
