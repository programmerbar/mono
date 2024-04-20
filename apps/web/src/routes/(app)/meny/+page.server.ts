import { getProducts } from '$lib/data/sanity/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = await getProducts();

	return {
		products
	};
};
