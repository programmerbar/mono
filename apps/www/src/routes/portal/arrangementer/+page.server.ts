import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const events = await locals.db.query.events.findMany({
		orderBy: (row, { asc }) => [asc(row.date)],
		with: {
			shifts: true
		},
    where: (events, { gte }) => gte(events.date, new Date())
	});

  const outdatedEvents = await locals.db.query.events.findMany({
    orderBy: (row, { desc }) => [desc(row.date)],
    with: {
      shifts: true
    },
    where: (events, { lt }) => lt(events.date, new Date())
  });

	return {
		events,
    outdatedEvents
	};
};
