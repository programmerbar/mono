import { error, fail, redirect } from '@sveltejs/kit';
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
	},
	join: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				message: 'Not logged in'
			});
		}

		const formData = await request.formData();
		const shiftId = formData.get('shiftId');
		if (!shiftId || typeof shiftId !== 'string') {
			return fail(400, {
				message: 'Missing shiftId'
			});
		}

		await locals.eventService.createUserShift({
			shiftId,
			userId: locals.user.id,
			status: 'accepted'
		});

		return { success: true };
	},
	leave: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				message: 'Not logged in'
			});
		}

		const formData = await request.formData();
		const shiftId = formData.get('shiftId');
		if (!shiftId || typeof shiftId !== 'string') {
			return fail(400, {
				message: 'Missing shiftId'
			});
		}

		await locals.eventService.deleteUserShift({
			shiftId,
			userId: locals.user.id
		});

		return { success: true };
	}
};
