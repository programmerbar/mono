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
	}
};
