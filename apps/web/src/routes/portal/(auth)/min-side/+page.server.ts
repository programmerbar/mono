import { userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const userSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	avatar: z.instanceof(File).nullable()
});

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	return {
		user
	};
};

export const actions: Actions = {
	default: async ({ locals, request, platform }) => {
		if (!locals.user) {
			return { success: false, errors: { user: ['Not logged in'] } };
		}

		const formData = await request.formData();
		const resp = userSchema.safeParse(Object.fromEntries(formData));

		if (!resp.success) {
			return { success: false, errors: resp.error.flatten() };
		}

		const { avatar, ...user } = resp.data;

		const avatarPath = `avatars/${locals.user.id}`;
		if (avatar && avatar.size > 0) {
			await platform?.env.R2.put(avatarPath, await avatar.arrayBuffer());
		} else {
			await platform?.env.R2.delete(avatarPath);
		}

		await locals.db.update(userTable).set(user).where(eq(userTable.id, locals.user.id));

		return { success: true };
	}
};
