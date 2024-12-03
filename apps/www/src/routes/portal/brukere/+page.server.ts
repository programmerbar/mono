import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [users, invitations] = await Promise.all([
		locals.userService.findAll(),
		locals.invitationService.findAllUnused()
	]);

	return {
		users,
		invitations
	};
};

export const actions: Actions = {
	changeRole: async ({ locals, request }) => {
		const user = locals.user;

		if (!user) {
			return fail(401, {
				error: 'unauthorized'
			});
		}

		if (user.role !== 'board') {
			return fail(403, {
				error: 'forbidden'
			});
		}

		const formData = await request.formData();

		const id = formData.get('id') as string;
		const role = formData.get('role') as 'board' | 'normal';

		if (!id || !role) {
			return fail(400, {
				error: 'bad request'
			});
		}

		await locals.userService.updateUserRole(id, role);

		return {
			message: 'Role changed'
		};
	}
};
