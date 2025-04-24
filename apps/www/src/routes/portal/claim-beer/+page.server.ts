import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getProducts } from '$lib/api/sanity/products';
import { claimedCredits } from '$lib/db/schemas';
import { gte, eq, desc, lte } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = await locals.user?.id;
	if (!userId) {
		throw redirect(301, '/');
	}
	const unclaimedBeers = await locals.beerService.getTotalAvailableBeers(userId);
	const products = await getProducts();

	const lastClaimed = await locals.db
		.select()
		.from(claimedCredits)
		.where(eq(claimedCredits.userId, userId))
		.orderBy(desc(claimedCredits.claimedAt))
		.limit(1);

	return {
		unclaimedBeers,
		products,
		user: locals.user,
		lastClaimed: lastClaimed[0] || null
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
		const userId = locals.user?.id;
		if (!userId) {
			return fail(401, {
				success: false,
				message: 'Please log in to claim products.'
			});
		}

		const data = await request.formData();
		const productId = data.get('productId')?.toString();
		const productName = data.get('productName')?.toString();
		const productType = data.get('productType')?.toString();
		const creditCostStr = data.get('creditCost')?.toString();

		if (!productId || !creditCostStr || !productName) {
			return fail(400, {
				success: false,
				message: 'Missing product information'
			});
		}

		const creditCost = parseInt(creditCostStr, 10);

		if (isNaN(creditCost) || creditCost <= 0) {
			return fail(400, {
				success: false,
				message: 'Invalid credit cost'
			});
		}

		try {
			const success = await locals.beerService.claimProductCredits(userId, creditCost, {
				productId,
				productName,
				productType: productType || undefined
			});

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
	},

	downloadClaimedCredits: async ({ request, locals }) => {
		if (locals.user?.role !== 'board') {
			return fail(403, {
				success: false,
				message: 'Unauthorized'
			});
		}

		try {
			const formData = await request.formData();
			const startDateStr = formData.get('startDate')?.toString();
			const endDateStr = formData.get('endDate')?.toString();

			let query = locals.db.select().from(claimedCredits).$dynamic();

			if (startDateStr) {
				const startDate = new Date(startDateStr);
				query = query.where(gte(claimedCredits.claimedAt, startDate));
			}

			if (endDateStr) {
				const endDate = new Date(endDateStr);
				query = query.where(lte(claimedCredits.claimedAt, endDate));
			}

			const credits = await query.orderBy(claimedCredits.claimedAt);

			const escapeCSV = (field: string | number | null): string => {
				if (field === null || field === undefined) return '""';
				let stringField = String(field);

				stringField = stringField.replace(/"/g, '""');

				return `"${stringField}"`;
			};

			const formatDate = (date: Date): string => {
				return date
					.toLocaleString('en-US', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit',
						hour12: false
					})
					.replace(/,/g, '');
			};

			const headers = [
				'User ID',
				'User Name',
				'Product ID',
				'Product Name',
				'Product Type',
				'Credit Cost',
				'Claimed At',
				'Created At'
			];

			const csvRows = [headers.join(',')];

			for (const credit of credits) {
				const row = [
					escapeCSV(credit.userId),
					escapeCSV(credit.userName),
					escapeCSV(credit.productId),
					escapeCSV(credit.productName),
					escapeCSV(credit.productType || ''),
					credit.creditCost,
					escapeCSV(formatDate(new Date(credit.claimedAt))),
					escapeCSV(formatDate(new Date(credit.createdAt)))
				];
				csvRows.push(row.join(','));
			}

			const BOM = '\uFEFF';
			const csvContent = BOM + csvRows.join('\r\n');

			return {
				success: true,
				csvContent
			};
		} catch (error) {
			console.error('Error generating CSV:', error);
			return fail(500, {
				success: false,
				message: 'Failed to generate CSV'
			});
		}
	}
};
