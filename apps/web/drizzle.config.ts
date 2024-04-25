import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	driver: 'd1',
	dbCredentials: {
		dbName: 'progbar-db',
		wranglerConfigPath: './wrangler.toml'
	},
	out: './migrations',
	schema: './src/lib/server/db/schema/index.ts'
});
