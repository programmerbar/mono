import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'board') {
		throw redirect(302, '/portal');
	}

	return {
		producerId: nanoid()
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (locals.user?.role !== 'board') {
			return fail(403, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const id = data.get('id') as string;
		const name = data.get('name') as string;
		const imageId = data.get('imageId') as string;

		if (!id?.trim()) {
			return fail(400, { message: 'ID er påkrevd' });
		}

		if (!name?.trim()) {
			return fail(400, { message: 'Navn er påkrevd' });
		}

		try {
			await locals.producerService.create({
				id: id.trim(),
				name: name.trim(),
				imageId: imageId?.trim() || null
			});
			throw redirect(302, '/portal/admin/cms/producers');
		} catch (error) {
			if (error instanceof Error && error.message.includes('redirect')) {
				throw error;
			}
			console.error('Error creating producer:', error);
			return fail(500, { message: 'Kunne ikke opprette produsent' });
		}
	}
};
