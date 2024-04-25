import { Lucia } from 'lucia';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';
import { dev } from '$app/environment';
import type { User } from '../db/schema';

export const createAuth = (D1: D1Database) => {
	const adapter = new D1Adapter(D1, {
		user: 'user',
		session: 'session'
	});

	return new Lucia(adapter, {
		getUserAttributes: (user) => user,
		sessionCookie: {
			attributes: {
				secure: !dev
			}
		}
	});
};

declare module 'lucia' {
	interface Register {
		Auth: ReturnType<typeof createAuth>;
		Lucia: ReturnType<typeof createAuth>;
		DatabaseUserAttributes: User;
	}
}
