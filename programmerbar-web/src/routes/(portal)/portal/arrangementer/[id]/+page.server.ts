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
		if (locals.user?.role === 'board') {
			await locals.eventService.delete(params.id);
			throw redirect(303, '/portal/arrangementer');
		}

		return fail(401, {
			message: 'Unauthorized'
		});
	},
	join: async ({ request, locals, params }) => {
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

		// Notify board members
		const event = await locals.eventService.findFullEventById(params.id);
		const boardMemebers = (await locals.userService.findAllBoardMembers()).map((user) => user.id);

		await locals.notificationService.sendNotifications(boardMemebers, {
			title: 'Ny frivillig på vakt',
			message: `${locals.user.name} har meldt seg på en vakt for ${event?.name ?? params.id}.`
		});

		return { success: true };
	},
	leave: async ({ request, locals, params }) => {
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

		// Notify board members
		const event = await locals.eventService.findFullEventById(params.id);
		const boardMemebers = (await locals.userService.findAllBoardMembers()).map((user) => user.id);

		await locals.notificationService.sendNotifications(boardMemebers, {
			title: 'Frivillig har forlatt vakt',
			message: `${locals.user.name} har forlatt vakten for ${event?.name ?? params.id}.`
		});

		return { success: true };
	}
};
