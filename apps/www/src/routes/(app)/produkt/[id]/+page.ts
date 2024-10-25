import { getProductById } from '$lib/api/sanity/products';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { dev } from '$app/environment';

export const load: PageLoad = async ({ params }) => {
	const product = await getProductById(params.id);

	if (!product) {
		throw error(404, 'Product not found');
	}

	const FRONTLINE_PROXY = dev ? 'http://localhost:8787' : 'https://frontline.programmer.bar';
	const stock = product.sku
		? await fetch(`${FRONTLINE_PROXY}/product/${product.sku}`)
				.then((res) => res.json())
				.then((data) => Number(data.stock))
		: null;

	return {
		product,
		stock
	};
};
