import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const event = await locals.eventService.findFullEventById(params.id);
	if (!event) {
		throw error(404, 'Event not found');
	}

	const users = await locals.userService.findAll().then((users) =>
		users.map((user) => ({
			label: user.name,
			value: user.id
		}))
	);

	return {
		event,
		users
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

	save: async ({ request, params, locals }) => {
		if (locals.user?.role !== 'board') {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const eventId = params.id;

		const updatedEvent = await locals.eventService.updateEvent(eventId, {
			name: String(formData.get('name') || ''),
			date: new Date(String(formData.get('date') || ''))
		});

		if (!updatedEvent) {
			return fail(500, { 
        message: 'Failed to update event' 
      });
		}

		const deletedShiftIds = formData.getAll('deletedShiftIds').map((id) => String(id));
		for (const shiftId of deletedShiftIds) {
			await locals.eventService.deleteShift(shiftId);
		}

		const existingEvent = await locals.eventService.findFullEventById(eventId);
    if(!existingEvent) {
      return fail(404, {
        message: "Event not found"
      })
    }


		const shiftsCount = parseInt(String(formData.get('shiftsCount') || '0'), 10);

		for (let i = 0; i < shiftsCount; i++) {
			const shiftId = formData.get(`shift[${i}].id`)?.toString();
			if (!shiftId) continue;

			await locals.eventService.updateShift(shiftId, {
				eventId: params.id,
				startAt: new Date(String(formData.get(`shift[${i}].startAt`))),
				endAt: new Date(String(formData.get(`shift[${i}].endAt`)))
			});


			const userCount = parseInt(String(formData.get(`shift[${i}].userCount`) || '0'), 10);
			const currentUserIds = [];

			for (let j = 0; j < userCount; j++) {
				const userId = formData.get(`shift[${i}].user[${j}].id`)?.toString();
				if (userId?.trim()) currentUserIds.push(userId);
			}

			const existingShift = existingEvent.shifts.find((s) => s.id === shiftId);
			const existingUserIds = existingShift?.members.map((m) => m.user.id) || [];

			for (const userId of currentUserIds) {
				if (!existingUserIds.includes(userId)) {
					const result = await locals.eventService.createUserShift({
						shiftId,
						userId,
						status: 'accepted'
					});

					if (!result) {
						return fail(500, {
							message: `Failed to add user to event`
						});
					}
				}
			}

			for (const userId of existingUserIds) {
				if (!currentUserIds.includes(userId)) {
					const result = await locals.eventService.deleteUserShift({
						shiftId,
						userId
					});
				}
			}
		}

		return { success: true, message: 'Event has been updated' };
	}
};
