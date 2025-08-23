import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'board') {
		throw redirect(302, '/portal');
	}

	const producers = await locals.producerService.getAll();

	return {
		producers
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
			const deleted = await locals.producerService.delete(id);

			if (!deleted) {
				return fail(404, { message: 'Produsent ikke funnet' });
			}

			return { success: true };
		} catch (error) {
			console.error('Error deleting producer:', error);
			return fail(500, { message: 'Kunne ikke slette produsent' });
		}
	}
};
