import { getProducts } from '$lib/server/sanity/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const products = await getProducts();
	const delay = Number(url.searchParams.get('delay')) || 10;
	const count = Number(url.searchParams.get('count')) || 10;
	const color = '#' + (url.searchParams.get('color') || '1fa7b2');

	return {
		products,
		delay,
		count,
		color
	};
};
