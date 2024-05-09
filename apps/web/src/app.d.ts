// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
interface Env {
	RESEND_API_KEY: string;
	DB: D1Database;
	R2: R2Bucket;
	KV: KVNamespace;
	FEIDE_CLIENT_ID: string;
	FEIDE_CLIENT_SECRET: string;
}

declare global {
	namespace App {
		interface Locals {
			// Services
			resend: import('resend').Resend | null;

			// Storages
			db: import('$lib/server/db/drizzle').Database;

			// Auth
			lucia: import('lucia').Lucia;
			user: import('lucia').User | null;
			session: import('lucia').Session | null;

			// Providers
			feide: import('$lib/server/auth/providers/feide').Feide;
		}
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
