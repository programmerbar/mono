import { getProductById } from '$lib/api/sanity/products';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getStock } from '$lib/api/stock';

export const load: PageLoad = async ({ params }) => {
	const product = await getProductById(params.id);

	if (!product) {
		throw error(404, 'Product not found');
	}

	const stock = await getStock(product.sku);

	return {
		product,
		stock
	};
};
