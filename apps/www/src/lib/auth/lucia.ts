import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { type Database } from '../db/drizzle';
import { type User, sessions, users } from '../db/schema';
import { dev } from '$app/environment';

export type Auth = ReturnType<typeof createAuth>;

export const createAuth = (db: Database) => {
	const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				secure: !dev
			}
		},
		getUserAttributes: (user) => user
	});
};

declare module 'lucia' {
	interface Register {
		Lucia: Auth;
		DatabaseUserAttributes: User;
	}
}
