import { getStatus } from '$lib/server/is-open';
import { getEvents } from '$lib/server/sanity/events';
import { getProducts } from '$lib/server/sanity/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [products, events, status] = await Promise.all([getProducts(), getEvents(), getStatus()]);

	return {
		status,
		products,
		events
	};
};
