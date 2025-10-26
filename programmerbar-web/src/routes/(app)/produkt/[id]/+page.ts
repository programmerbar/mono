import { getProductById } from '$lib/api/sanity/queries';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const product = await getProductById(params.id);

	if (!product) {
		throw error(404, 'Product not found');
	}

	return {
		product
	};
};
