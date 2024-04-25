import { userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const userSchema = z.object({
	name: z.string().min(1),
	email: z.string().email()
});

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	return {
		user
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (!locals.user) {
			return { success: false, errors: { user: ['Not logged in'] } };
		}

		const formData = await request.formData();
		const resp = userSchema.safeParse(Object.fromEntries(formData));

		if (!resp.success) {
			return { success: false, errors: resp.error.flatten() };
		}

		const user = resp.data;

		await locals.db.update(userTable).set(user).where(eq(userTable.id, locals.user.id));

		return { success: true };
	}
};
