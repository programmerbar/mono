import { dev } from '$app/environment';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.session) {
			return { success: true };
		}

		await locals.auth.invalidateSession(locals.session.id);
		cookies.delete(locals.auth.sessionCookieName, {
			path: '/',
		});

		return { success: true };
	}
};
