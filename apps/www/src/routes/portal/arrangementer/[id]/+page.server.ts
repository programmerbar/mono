import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const event = await locals.eventService.findFullEventById(params.id);

	if (!event) {
		throw error(404, 'Event not found');
	}

	return {
		event
	};
};

export const actions: Actions = {
	delete: async ({ params, locals }) => {
		await locals.eventService.delete(params.id);
		throw redirect(303, '/portal/arrangementer');
	}
};
