import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user || locals.user.role !== 'board') {
		throw redirect(302, '/portal');
	}

	const productType = await locals.productTypeService.getById(params.id);
	if (!productType) {
		throw error(404, 'Product type not found');
	}

	return {
		productType
	};
};

export const actions: Actions = {
	default: async ({ locals, request, params }) => {
		if (!locals.user || locals.user.role !== 'board') {
			throw redirect(302, '/portal');
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;

		if (!title) {
			return fail(400, { error: 'Title is required' });
		}

		try {
			await locals.productTypeService.update(params.id, {
				title
			});
		} catch (err) {
			console.error('Error updating product type:', err);
			return fail(400, { error: 'Failed to update product type' });
		}

		throw redirect(302, '/portal/admin/cms/product-types');
	}
};
