import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getProducts } from '$lib/server/sanity/products';

export const GET: RequestHandler = async () => {
	const products = await getProducts();
	return json(products);
};
