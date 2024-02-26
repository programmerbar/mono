import { getEvents } from '$lib/server/sanity/events';
import { getProducts } from '$lib/server/sanity/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [products, events] = await Promise.all([getProducts(), getEvents()]);

	return {
		products,
		events
	};
};
