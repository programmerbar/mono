import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [events, outdatedEvents] = await Promise.all([
		locals.eventService.findUpcomingEvents(),
		locals.eventService.findPastEvents()
	]);

	return {
		events,
		outdatedEvents
	};
};
