import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	addBeers: async ({ params, request, locals }) => {
		const userId = params.id;
		if (!locals.user || locals.user.role !== 'board') {
			return fail(401, {
				success: false,
				message: 'Unauthorized'
			});
		}
		const formData = await request.formData();
		const additionalBeers = +Number(formData.get('additionalBeers'));
		const success = await locals.beerService.updateBeers(userId, additionalBeers);
		if (!success) {
			return fail(400, {
				success: false,
				message: 'Failed to update beers'
			});
		}
		return { success: true };
	},

	deleteUser: async ({ params, request, locals }) => {
		if (!locals.user || locals.user.role !== 'board') {
			return fail(401, {
				success: false,
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const confirmDelete = formData.get('confirmDelete')?.toString();
		const formUserId = formData.get('userId')?.toString();
		
		// Use user ID from form data or fallback to params
		const userId = formUserId || params.id;

		if (!userId) {
			return fail(400, {
				success: false,
				message: 'User ID is required'
			});
		}

		const user = await locals.userService.findById(userId);
		if (!user) {
			return fail(404, {
				success: false,
				message: 'User not found'
			});
		}

		if (confirmDelete !== user.name) {
			return fail(400, {
				success: false,
				message: "Names dosen't match"
			});
		}

		const success = await locals.userService.deleteUser(userId);

		const invId = await locals.invitationService.findByEmail(user.email);

		if (invId) {
			await locals.invitationService.delete(invId.id);
		}

		if (!success) {
			return fail(400, {
				success: false,
				message: 'Failed to delete user'
			});
		}

		return { success: true };
	}
};
