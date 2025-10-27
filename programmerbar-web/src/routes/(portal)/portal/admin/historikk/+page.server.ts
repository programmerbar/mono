import { claimedCredits } from '$lib/server/db/schemas';
import { parseDateTimeLocal } from '$lib/utils/date';
import { and, count, gte, lte } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 10;

export const load: PageServerLoad = async ({ locals, url }) => {
	const page = Number(url.searchParams.get('page') ?? '1');
	const requestedPage = Number.isNaN(page) || page < 1 ? 1 : page;

	const startDateParam = url.searchParams.get('startDate');
	const endDateParam = url.searchParams.get('endDate');

	const parseDate = (value: string | null) => {
		if (!value) return null;
		try {
			return parseDateTimeLocal(value);
		} catch {
			return null;
		}
	};

	const startDate = parseDate(startDateParam);
	const endDate = parseDate(endDateParam);

	const startCondition = startDate ? gte(claimedCredits.createdAt, startDate) : undefined;
	const endCondition = endDate ? lte(claimedCredits.createdAt, endDate) : undefined;
	const whereClause =
		startCondition && endCondition
			? and(startCondition, endCondition)
			: (startCondition ?? endCondition);

	const baseTotalQuery = locals.db.select({ count: count() }).from(claimedCredits);
	const totalCountRows = await (whereClause ? baseTotalQuery.where(whereClause) : baseTotalQuery);
	const [{ count: totalCount }] = totalCountRows;
	const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
	const currentPage = Math.min(requestedPage, pageCount);

	const items = await locals.db.query.claimedCredits.findMany({
		where: whereClause,
		orderBy: (row, { desc }) => [desc(row.createdAt)],
		limit: PAGE_SIZE,
		offset: (currentPage - 1) * PAGE_SIZE,
		with: {
			user: true
		}
	});

	return {
		claimedCredits: items,
		filters: {
			startDate: startDate && startDateParam ? startDateParam : '',
			endDate: endDate && endDateParam ? endDateParam : ''
		},
		pagination: {
			currentPage,
			pageCount,
			pageSize: PAGE_SIZE,
			totalCount
		}
	};
};
