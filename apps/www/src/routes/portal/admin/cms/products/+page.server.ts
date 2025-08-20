import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'board') {
		throw redirect(302, '/portal');
	}

	const [products, producers, productTypes] = await Promise.all([
		locals.productService.getAll(),
		locals.producerService.getAll(),
		locals.productTypeService.getAll()
	]);

	return {
		products,
		producers,
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
			const deleted = await locals.productService.delete(id);

			if (!deleted) {
				return fail(404, { message: 'Produkt ikke funnet' });
			}

			return { success: true };
		} catch (error) {
			console.error('Error deleting product:', error);
			return fail(500, { message: 'Kunne ikke slette produkt' });
		}
	},

	toggleSoldOut: async ({ request, locals }) => {
		if (locals.user?.role !== 'board') {
			return fail(403, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const id = data.get('id') as string;
		const isSoldOut = data.get('isSoldOut') === 'true';

		if (!id) {
			return fail(400, { message: 'ID er påkrevd' });
		}

		try {
			await locals.productService.update(id, { isSoldOut });
			return { success: true };
		} catch (error) {
			console.error('Error updating product:', error);
			return fail(500, { message: 'Kunne ikke oppdatere produkt' });
		}
	}
};
