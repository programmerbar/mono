import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const events = await locals.db.query.events.findMany({
		orderBy: (row, { asc }) => [asc(row.date)],
		with: {
			shifts: true
		}
	});

	return {
		events
	};
};
