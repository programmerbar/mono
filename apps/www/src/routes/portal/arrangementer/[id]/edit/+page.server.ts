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
		if (locals.user?.role !== 'board') {
			return fail(401, { message: 'Unauthorized' });
		}

		await locals.eventService.delete(params.id);
		throw redirect(303, '/portal/arrangementer');
	},

	save: async ({ request, params, locals }) => {
		if (locals.user?.role !== 'board') {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const eventId = params.id;

		await locals.eventService.updateEvent(params.id, {
			name: String(formData.get('name') || ''),
			date: new Date(String(formData.get('date') || ''))
		});

		const deletedShiftIds = formData.getAll('deletedShiftIds').map((id) => String(id));
		for (const shiftId of deletedShiftIds) {
			await locals.eventService.deleteShift(shiftId);
		}

		const removedUserShifts = formData.getAll('removedUserShifts').map((kv) => String(kv));
		for (const userShift of removedUserShifts) {
			const [shiftId, userId] = userShift.split('|');
			if (shiftId && userId) {
				await locals.eventService.deleteUserShift({ shiftId, userId });
			}
		}

		const existingEvent = await locals.eventService.findFullEventById(eventId);
		if (!existingEvent) {
			return fail(404, { message: 'Event not found' });
		}

		const shiftsCount = parseInt(String(formData.get('shiftsCount') || '0'), 10);
		const processedShifts = [];

		for (let i = 0; i < shiftsCount; i++) {
			const shiftId = formData.get(`shift[${i}].id`)?.toString();
			const startAt = new Date(String(formData.get(`shift[${i}].startAt`)));
			const endAt = new Date(String(formData.get(`shift[${i}].endAt`)));

			let shift;

			if (shiftId) {
				shift = await locals.eventService.updateShift(shiftId, {
					eventId,
					startAt,
					endAt
				});
			} else {
				const shifts = await locals.eventService.createShifts([
					{
						eventId,
						startAt,
						endAt
					}
				]);
				shift = shifts?.[0];
			}

			if (!shift) {
				return fail(500, { message: 'Failed to create/update shift' });
			}

			processedShifts.push({
				shiftId: shift.id,
				index: i
			});
		}

		for (const { shiftId, index } of processedShifts) {
			const userCount = parseInt(String(formData.get(`shift[${index}].userCount`) || '0'), 10);

			const existingShift = existingEvent.shifts.find((s) => s.id === shiftId);
			const existingUserIds = existingShift?.members.map((m) => m.user.id) || [];

			const newUserIds: string[] = [];
			for (let j = 0; j < userCount; j++) {
				const userId = formData.get(`shift[${index}].user[${j}].id`)?.toString();
				if (userId?.trim()) {
					newUserIds.push(userId);
				}
			}

			const usersToAdd = newUserIds.filter((userId) => !existingUserIds.includes(userId));
			const usersToRemove = existingUserIds.filter((userId) => !newUserIds.includes(userId));

			if (usersToAdd.length > 0) {
				const userShiftsToCreate = usersToAdd.map((userId) => ({
					shiftId,
					userId
				}));
				await locals.eventService.createUserShifts(userShiftsToCreate);
			}

			for (const userId of usersToRemove) {
				await locals.eventService.deleteUserShift({ shiftId, userId });
			}
		}

		return { success: true, message: 'Vakten har blitt oppdatert' };
	}
};
