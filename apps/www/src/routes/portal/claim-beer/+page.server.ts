import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = await locals.user?.id;

	if (!userId) {
		throw redirect(301, '/');
	}

	const unclaimedBeers = await locals.beerService.getTotalAvailableBeers(userId);

	return {
		unclaimedBeers
	};
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, {
				success: false,
				message: 'Please log in to claim your beer.'
			});
		}

		try {
			const success = await locals.beerService.claimBeer(userId);

			if (success) {
				return { success: true, message: 'Beer claimed.' };
			} else {
				return { success: false, message: 'No more beers left to claim.' };
			}
		} catch (err) {
			console.error('Error claiming beer:', err);
			return fail(500, {
				success: false,
				message: 'Internal error'
			});
		}
	}
};
