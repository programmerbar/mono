import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user || locals.user.role !== 'board') {
		throw redirect(302, '/portal');
	}

	const [product, producers, productTypes] = await Promise.all([
		locals.productService.getById(params.id),
		locals.producerService.getAll(),
		locals.productTypeService.getAll()
	]);

	if (!product) {
		throw error(404, 'Product not found');
	}

	return {
		product: {
			...product,
			productTypeIds: product.types?.map((t) => t.id) || []
		},
		producers,
		productTypes
	};
};

export const actions: Actions = {
	default: async ({ locals, request, params }) => {
		if (!locals.user || locals.user.role !== 'board') {
			throw redirect(302, '/portal');
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const sku = formData.get('sku') as string;
		const ordinaryPrice = formData.get('ordinaryPrice') as string;
		const studentPrice = formData.get('studentPrice') as string;
		const internalPrice = formData.get('internalPrice') as string;
		const credits = formData.get('credits') as string;
		const volume = formData.get('volume') as string;
		const alcoholContent = formData.get('alcoholContent') as string;
		const variants = formData.get('variants') as string;
		const producerId = formData.get('producerId') as string;
		const imageId = formData.get('imageId') as string | null;
		const productTypeIds = formData.getAll('productTypeIds') as string[];
		const isSoldOut = formData.get('isSoldOut') === 'true';

		if (!name || !ordinaryPrice || !studentPrice || !internalPrice) {
			return fail(400, { error: 'Name and prices are required' });
		}

		try {
			await locals.productService.update(
				params.id,
				{
					name,
					description: description || null,
					sku: sku || null,
					ordinaryPrice: parseFloat(ordinaryPrice),
					studentPrice: parseFloat(studentPrice),
					internalPrice: parseFloat(internalPrice),
					credits: credits ? parseInt(credits) : null,
					volume: volume ? parseFloat(volume) : null,
					alcoholContent: alcoholContent ? parseFloat(alcoholContent) : null,
					variants: variants || null,
					producerId: producerId || null,
					imageId: imageId || null,
					isSoldOut
				},
				productTypeIds
			);
		} catch (err) {
			console.error('Error updating product:', err);
			return fail(400, { error: 'Failed to update product' });
		}

		throw redirect(302, '/portal/admin/cms/products');
	}
};
