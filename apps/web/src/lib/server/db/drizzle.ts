import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export type Database = ReturnType<typeof createDatabase>;

export const createDatabase = (db: D1Database) => {
	return drizzle(db, {
		schema
	});
};
