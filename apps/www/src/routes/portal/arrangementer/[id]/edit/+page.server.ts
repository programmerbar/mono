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

		await locals.eventService.updateEvent(params.id, {
			name: formData.get('name') as string,
			date: new Date(formData.get('date') as string)
		});

		for (const id of formData.getAll('deletedShiftIds')) {
			await locals.eventService.deleteShift(id.toString());
		}

		const existingEvent = await locals.eventService.findFullEventById(params.id);

		const shiftsCount = parseInt(formData.get('shiftsCount')?.toString() || '0', 10);

		for (let i = 0; i < shiftsCount; i++) {
			const shiftId = formData.get(`shift[${i}].id`)?.toString();
			if (!shiftId) continue;

			await locals.eventService.updateShift(shiftId, {
				eventId: params.id,
				startAt: new Date(formData.get(`shift[${i}].startAt`) as string),
				endAt: new Date(formData.get(`shift[${i}].endAt`) as string)
			});

			const userCount = parseInt(formData.get(`shift[${i}].userCount`)?.toString() || '0', 10);
			const currentUserIds = [];

			for (let j = 0; j < userCount; j++) {
				const userId = formData.get(`shift[${i}].user[${j}].id`)?.toString();
				if (userId?.trim()) currentUserIds.push(userId);
			}

			const existingShift = existingEvent.shifts.find((s) => s.id === shiftId);
			const existingUserIds = existingShift?.members.map((m) => m.user.id) || [];

			for (const userId of currentUserIds) {
				if (!existingUserIds.includes(userId)) {
					await locals.eventService.createUserShift({
						shiftId,
						userId,
						status: 'accepted'
					});
				}
			}

			for (const existingId of existingUserIds) {
				if (!currentUserIds.includes(existingId)) {
					await locals.eventService.deleteUserShift({
						shiftId,
						userId: existingId
					});
				}
			}
		}

		return { success: true, message: 'Arrangementet ble oppdatert' };
	}
};
