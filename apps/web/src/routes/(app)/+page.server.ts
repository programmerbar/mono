import { getStatus } from '$lib/data/api';
import { getEvents } from '$lib/data/sanity/events';
import { getProducts } from '$lib/data/sanity/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [products, events, status] = await Promise.all([getProducts(), getEvents(), getStatus()]);

	return {
		status,
		products,
		events
	};
};
