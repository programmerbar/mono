// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
interface Env {
	RESEND_API_KEY: string;
}

declare global {
	namespace App {
		interface Locals {
			resend: import('resend').Resend;
		}
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
