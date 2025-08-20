import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'board') {
		throw redirect(302, '/portal');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (locals.user?.role !== 'board') {
			return fail(403, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const title = data.get('title') as string;

		if (!title?.trim()) {
			return fail(400, { message: 'Tittel er påkrevd' });
		}

		try {
			await locals.productTypeService.create({ title: title.trim() });
			throw redirect(302, '/portal/admin/cms/product-types');
		} catch (error) {
			if (error instanceof Error && error.message.includes('redirect')) {
				throw error;
			}
			console.error('Error creating product type:', error);
			return fail(500, { message: 'Kunne ikke opprette produkttype' });
		}
	}
};
