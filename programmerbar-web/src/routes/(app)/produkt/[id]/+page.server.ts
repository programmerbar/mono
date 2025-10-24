import { getProductById } from '$lib/api/sanity/products';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	claimProduct: async ({ locals, params }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, {
				success: false,
				message: 'Please log in to claim products.'
			});
		}

		const productId = params.id;

		if (!productId) {
			return fail(400, {
				success: false,
				message: 'Missing product information'
			});
		}

		const product = await getProductById(productId);

		if (!product) {
			return fail(404, {
				success: false,
				message: 'Produktet finnes ikke'
			});
		}

		const creditCost = product.priceList.credits;

		if (!creditCost || creditCost <= 0) {
			return fail(400, {
				success: false,
				message: 'Dette produktet kan ikkje claimast med bonger'
			});
		}

		const success = await locals.beerService.claimProductCredits(userId, creditCost, {
			productId
		});

		if (!success) {
			return fail(400, {
				success: false,
				message: 'Du har ikkje nokk bonger til å claime dette produktet'
			});
		}

		const users = await locals.userService.findAllBoardMembers();

		await Promise.all(
			users.map((user) => {
				return locals.notificationService.create(
					user.id,
					'Produkt claimet',
					`${locals.user?.name} har claimed produktet ${product.name} for ${creditCost} credits.`
				);
			})
		);

		const updatedBeerCount = await locals.beerService.getTotalAvailableBeers(userId);

		return {
			success: true,
			message: `Produkt claimet for ${creditCost} credits.`,
			productId,
			updatedBeerCount
		};
	}
};
