import { getEvents, getRepeatingEvents } from '$lib/api/sanity/events';
import { getProducts } from '$lib/api/sanity/products';
import { getStatus } from '$lib/api/status';
import { flattenRepeatingEvents } from '$lib/repeating-events';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [products, events, status, repeatingEvents] = await Promise.all([
		getProducts(),
		getEvents(),
		getStatus(),
		getRepeatingEvents()
	]);

	const allRepeatingEvents = flattenRepeatingEvents(repeatingEvents);
	const allEvents = [...events, ...allRepeatingEvents]
		.filter((event) => Date.now() <= new Date(event.date).getTime())
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, 6);

	return {
		products,
		events: allEvents,
		status
	};
};
