import { fail, redirect } from '@sveltejs/kit';
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
		const userId = params.id;

		if (!locals.user || locals.user.role !== 'board') {
			return fail(401, {
				success: false,
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const confirmDelete = formData.get('confirmDelete')?.toString();

		const user = await locals.userService.findById(userId);
		if (confirmDelete !== user?.name) {
			return fail(400, {
				success: false,
				message: "Names dosen't match"
			});
		}
		const success = await locals.userService.deleteUser(userId);
		const invID = await locals.invitationService.findByEmail(user?.email);
		console.log(invID);
		const invsuccess = await locals.invitationService.delete(invID?.id);
		console.log(invsuccess);

		if (!success || !invsuccess) {
			return fail(400, {
				success: false,
				message: 'Failed to delete user'
			});
		}

		return { success: true };
	}
};
