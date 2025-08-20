/* eslint-disable @typescript-eslint/no-explicit-any */
import { setup } from './setup';
import * as schema from '../src/lib/db/schemas';
import { reset } from 'drizzle-seed';
import { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';

async function main() {
	const { db } = await setup();
	await reset(
		db as unknown as BaseSQLiteDatabase<
			any,
			any,
			Record<string, never>,
			ExtractTablesWithRelations<Record<string, never>>
		>,
		schema
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
