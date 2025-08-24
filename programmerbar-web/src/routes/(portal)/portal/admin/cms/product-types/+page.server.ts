import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'board') {
		throw redirect(302, '/portal');
	}

	const productTypes = await locals.productTypeService.getAll();

	return {
		productTypes
	};
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (locals.user?.role !== 'board') {
			return fail(403, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) {
			return fail(400, { message: 'ID er påkrevd' });
		}

		try {
			const deleted = await locals.productTypeService.delete(id);

			if (!deleted) {
				return fail(404, { message: 'Produkttype ikke funnet' });
			}

			return { success: true };
		} catch (error) {
			console.error('Error deleting product type:', error);
			return fail(500, { message: 'Kunne ikke slette produkttype' });
		}
	}
};
