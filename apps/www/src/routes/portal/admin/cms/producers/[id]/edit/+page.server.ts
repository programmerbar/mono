import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user || locals.user.role !== 'board') {
		throw redirect(302, '/portal');
	}

	const producer = await locals.producerService.getById(params.id);
	if (!producer) {
		throw error(404, 'Producer not found');
	}

	return {
		producer
	};
};

export const actions: Actions = {
	default: async ({ locals, request, params }) => {
		if (!locals.user || locals.user.role !== 'board') {
			throw redirect(302, '/portal');
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const imageId = formData.get('imageId') as string | null;

		if (!name) {
			return { error: 'Name is required' };
		}

		try {
			await locals.producerService.update(params.id, {
				name,
				imageId: imageId || null
			});

			throw redirect(302, '/portal/admin/cms/producers');
		} catch (err) {
			console.error('Error updating producer:', err);
			return { error: 'Failed to update producer' };
		}
	}
};
