import { getEvents as getSanityEvents, getRepeatingEvents } from '$lib/api/sanity/events';
import { getProducts } from '$lib/api/sanity/products';
import { flattenRepeatingEvents } from '$lib/repeating-events';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [products, sanityEvents, dbEvents, status, repeatingEvents] = await Promise.all([
		getProducts(),
		getSanityEvents(),
		locals.eventService.getUpcomingPublicEvents(),
		locals.statusService.getWithMessage(),
		getRepeatingEvents()
	]);

	const p = products.filter((product) => !product.isSoldOut);
	const allRepeatingEvents = flattenRepeatingEvents(repeatingEvents);
	const allEvents = [...sanityEvents, ...allRepeatingEvents, ...dbEvents]
		.filter((event) => Date.now() <= new Date(event.date).getTime())
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, 6);

	return {
		products: p,
		events: allEvents,
		status
	};
};
