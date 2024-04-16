import { getProductById } from '$lib/server/sanity/products';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	const product = await getProductById(id);

	if (!product) {
		throw error(404, 'Product not found');
	}

	return {
		product
	};
};
