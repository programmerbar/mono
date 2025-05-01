import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getProducts } from '$lib/api/sanity/products';
import { claimedCredits, users } from '$lib/db/schemas';
import { gte, eq, desc, lte, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = await locals.user?.id;
	if (!userId) {
		throw redirect(301, '/');
	}
	const unclaimedBeers = await locals.beerService.getTotalAvailableBeers(userId);
	const products = await getProducts();

	const lastClaimedCredit = await locals.db
		.select()
		.from(claimedCredits)
		.where(eq(claimedCredits.userId, userId))
		.orderBy(desc(claimedCredits.createdAt))
		.limit(1);

	let lastClaimed = null;

	if (lastClaimedCredit[0]) {
		const product = products.find((p) => p._id === lastClaimedCredit[0].productId);
		if (product) {
			lastClaimed = {
				productName: product.name,
				claimedAt: lastClaimedCredit[0].createdAt
			};
		}
	}

	return {
		unclaimedBeers,
		products,
		user: locals.user,
		lastClaimed
	};
};

export const actions: Actions = {
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
		const creditCostStr = data.get('creditCost')?.toString();

		if (!productId || !creditCostStr) {
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
				productId
			});

			if (success) {
				const users = await locals.groupsService.getUsersById('board');
				await Promise.all(
					users.map((user) => {
						return locals.notificationService.create(
							user.userId,
							'Produkt claimet',
							`${locals.user?.name} har claimed productet ${productId} for ${creditCost} credits.`
						);
					})
				);
			}

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

			const products = await getProducts();

			const whereConditions = [];

			if (startDateStr) {
				const startDate = new Date(startDateStr);
				whereConditions.push(gte(claimedCredits.createdAt, startDate));
			}

			if (endDateStr) {
				const endDate = new Date(endDateStr);
				whereConditions.push(lte(claimedCredits.createdAt, endDate));
			}

			const creditsQuery = locals.db.select().from(claimedCredits);

			const creditRecords = await (whereConditions.length > 0
				? creditsQuery.where(and(...whereConditions))
				: creditsQuery);

			const creditsWithDetails = await Promise.all(
				creditRecords.map(async (credit) => {
					const userResult = await locals.db
						.select({ name: users.name })
						.from(users)
						.where(eq(users.id, credit.userId))
						.limit(1);

					const product = products.find((p) => p._id === credit.productId);

					return {
						...credit,
						userName: userResult[0]?.name || 'Unknown User',
						productName: product?.name || 'Unknown Product'
					};
				})
			);

			creditsWithDetails.sort(
				(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			);

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

			const headers = ['Product', 'Name', 'Cost', 'Created At'];
			const csvRows = [headers.join(',')];

			for (const credit of creditsWithDetails) {
				const row = [
					escapeCSV(credit.productName),
					escapeCSV(credit.userName),
					credit.creditCost || 0,
					credit.createdAt ? escapeCSV(formatDate(new Date(credit.createdAt))) : '""'
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
