import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user?.role !== 'board') {
		throw redirect(307, '/portal');
	}

	const page = Number(url.searchParams.get('page') ?? '1');
	const requestedPage = Number.isNaN(page) || page < 1 ? 1 : page;

	const totalCount = await locals.referralService.countAllReferrals();
	const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
	const currentPage = Math.min(requestedPage, pageCount);

	const referrals = await locals.referralService.getAllReferrals({
		limit: PAGE_SIZE,
		offset: (currentPage - 1) * PAGE_SIZE
	});

	return {
		referrals,
		pagination: {
			currentPage,
			pageCount,
			pageSize: PAGE_SIZE,
			totalCount
		}
	};
};
