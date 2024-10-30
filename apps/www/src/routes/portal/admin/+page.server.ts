import { UserService } from '$lib/services/user.service';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user || locals.user.role !== 'board') {
		throw redirect(303, '/portal');
	}

	const userService = new UserService(locals.db);
	const users = await userService.findAll();

	return {
		user: locals.user,
		users
	};
}

export const actions = {
	updateRole: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');
		const role = formData.get('role');

		if (!locals.user || locals.user.role !== 'board') {
			return { status: 401, body: { error: 'Unauthorized' } };
		}

		const userService = new UserService(locals.db);
		const success = await userService.updateUserRole(userId as string, role as string);

		if (success) {
			return { status: 200 };
		} else {
			return { status: 500, body: { error: 'Failed to update user role' } };
		}
	}
};
