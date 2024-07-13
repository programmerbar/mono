// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
interface Env {
	RESEND_API_KEY: string;
	R2: R2Bucket;
	KV: KVNamespace;
}

declare global {
	namespace App {
		interface Locals {
			// Services
			resend: import('resend').Resend | null;
		}
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
