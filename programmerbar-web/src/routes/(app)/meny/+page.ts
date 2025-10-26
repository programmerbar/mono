import { getProducts } from '$lib/api/sanity/queries';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const products = await getProducts();

	return {
		products
	};
};
