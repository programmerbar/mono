import { createDatabase } from '../src/lib/db/drizzle';
import { type D1Database } from '@cloudflare/workers-types';
import { getPlatformProxy } from 'wrangler';
import { invitations } from '../src/lib/db/schemas';
import { nanoid } from 'nanoid';

type Env = {
	DB: D1Database;
};

// Example "tsx ./apps/www/scripts/add-invitation.ts "some@email.com""
const main = async () => {
	const { env } = await getPlatformProxy<Env>({
		configPath: './apps/www/wrangler.toml',
		persist: {
			path: './apps/www/.wrangler/state/v3'
		}
	});

	const db = createDatabase(env.DB);

	const email = process.argv[2];

	if (!email) {
		throw new Error(
			'Email is required. Example: pnpm --filter=www run add-invitation -- "some@email.com"'
		);
	}

	await db.insert(invitations).values({
		createdAt: new Date(),
		email,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
		id: nanoid()
	});

	console.log(`Invitation for ${email} added.`);
};

main()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
