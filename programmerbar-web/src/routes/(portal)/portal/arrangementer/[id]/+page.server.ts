import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { shifts } from '$lib/db/schemas';
import { eq } from 'drizzle-orm';
import { normalDate } from '$lib/date';

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
		if (locals.user?.role === 'board') {
			await locals.eventService.delete(params.id);
			throw redirect(303, '/portal/arrangementer');
		}

		return fail(401, {
			message: 'Unauthorized'
		});
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

		if (!locals.user.isTrained) {
			await locals.notificationService.notifyOpplaering(locals.user.id, locals.user.email);
		}

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

		const shift = await locals.db.select().from(shifts).where(eq(shifts.id, shiftId)).limit(1);
		const shiftData = shift[0];
		const event = shiftData ? await locals.eventService.findFullEventById(shiftData.eventId) : null;

		await locals.eventService.deleteUserShift({
			shiftId,
			userId: locals.user.id
		});

		if (event && shiftData) {
			const shiftTime = `${normalDate(shiftData.startAt)} - ${normalDate(shiftData.endAt)}`;
			await locals.notificationService.notifyEventDeparture(locals.user.id, event.name, shiftTime);
		}

		return { success: true };
	}
};
