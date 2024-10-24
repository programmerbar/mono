import { getEvents } from '$lib/api/sanity/events';
import { getProducts } from '$lib/api/sanity/products';
import { getStatus } from '$lib/api/status';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [products, events, status] = await Promise.all([getProducts(), getEvents(), getStatus()]);

	return {
		products,
		events,
		status
	};
};
