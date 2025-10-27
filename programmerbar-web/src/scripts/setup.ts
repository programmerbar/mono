import { createDatabase } from '../lib/server/db/drizzle';
import { getPlatformProxy } from 'wrangler';

interface Env {
	DB: D1Database;
}

export async function setup() {
	const { env } = await getPlatformProxy<Env>({
		configPath: './programmerbar-web/wrangler.jsonc',
		persist: {
			path: './programmerbar-web/.wrangler/state/v3'
		}
	});
	const db = createDatabase(env.DB);

	return {
		env,
		db
	};
}
