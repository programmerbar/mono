import { getProducts } from '$lib/api/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = await getProducts();

	return {
		products
	};
};
