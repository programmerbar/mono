import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user || locals.user.role !== 'board') {
		throw redirect(303, '/portal');
	}

	const users = await locals.userService.findAll();

	return {
		user: locals.user,
		users
	};
}

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = formData.get('userId') as string;
		const role = formData.get('role') as string;

		if (!locals.user || locals.user.role !== 'board') {
			return fail(401, { error: 'Unauthorized' });
		}

		const success = await locals.userService.updateUserRole(userId, role);

		if (success) {
			return { success: true };
		} else {
			return fail(500, { error: 'Failed to update user role' });
		}
	}
};
