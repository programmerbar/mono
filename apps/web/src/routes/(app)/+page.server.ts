import { getStatus } from '$lib/data/api';
import { getUpcomingEvents } from '$lib/data/sanity/events';
import { getProducts } from '$lib/data/sanity/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [products, events, status] = await Promise.all([
		getProducts(),
		getUpcomingEvents(),
		getStatus()
	]);

	return {
		status,
		products,
		events
	};
};
