/* eslint-disable @typescript-eslint/no-explicit-any */
import { setup } from './setup';
import * as schema from '../src/lib/db/schemas';
import { seed } from 'drizzle-seed';
import { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';

async function main() {
	const { db } = await setup();
	await seed(
		db as unknown as BaseSQLiteDatabase<
			any,
			any,
			Record<string, never>,
			ExtractTablesWithRelations<Record<string, never>>
		>,
		schema,
		{
			count: 5,
			seed: Math.floor(Math.random() * 1000) + 1
		}
	);
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
