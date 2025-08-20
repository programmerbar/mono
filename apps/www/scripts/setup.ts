import { createDatabase } from '../src/lib/db/drizzle';
import { type D1Database } from '@cloudflare/workers-types';
import { getPlatformProxy } from 'wrangler';

interface Env {
	DB: D1Database;
}

export async function setup() {
	const { env } = await getPlatformProxy<Env>({
		configPath: './apps/www/wrangler.jsonc',
		persist: {
			path: './apps/www/.wrangler/state/v3'
		}
	});
	const db = createDatabase(env.DB);

	return {
		env,
		db
	};
}
