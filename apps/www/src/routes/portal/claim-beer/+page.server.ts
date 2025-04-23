import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getProducts } from '$lib/api/sanity/products';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = await locals.user?.id;
	if (!userId) {
		throw redirect(301, '/');
	}
	const unclaimedBeers = await locals.beerService.getTotalAvailableBeers(userId);
	const products = await getProducts();
	return {
		unclaimedBeers,
		products
	};
};

export const actions: Actions = {
	claimBeer: async ({ locals }) => {
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
	},

	claimProduct: async ({ request, locals }) => {
		console.log('Works 1');
		const userId = locals.user?.id;
		if (!userId) {
			return fail(401, {
				success: false,
				message: 'Please log in to claim products.'
			});
		}

		console.log('Works 2');
		const data = await request.formData();
		const productId = data.get('productId')?.toString();
		const creditCostStr = data.get('creditCost')?.toString();
		if (!productId || !creditCostStr) {
			return fail(400, {
				success: false,
				message: 'Missing product information'
			});
		}

		console.log('Works 3');
		const creditCost = parseInt(creditCostStr, 10);

		if (isNaN(creditCost) || creditCost <= 0) {
			return fail(400, {
				success: false,
				message: 'Invalid credit cost'
			});
		}

		console.log('Works 4');
		try {
			const success = await locals.beerService.claimProductCredits(userId, creditCost);

			console.log('Works 5');
			if (success) {
				const updatedBeerCount = await locals.beerService.getTotalAvailableBeers(userId);

				return {
					success: true,
					message: `Product claimed successfully for ${creditCost} credits.`,
					productId,
					updatedBeerCount
				};
			} else {
				return fail(400, {
					success: false,
					message: 'Not enough credits to claim this product'
				});
			}
		} catch (err) {
			console.error('Error claiming product:', err);
			return fail(500, {
				success: false,
				message: 'Internal error while claiming product'
			});
		}
	}
};
