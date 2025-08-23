import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();
	const { notifications } = parentData;

	return {
		notifications
	};
};

export const actions = {
	archive: async ({ locals, request }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const notificationId = formData.get('notificationId') as string;

		if (!notificationId) {
			return fail(400, {
				message: 'Missing notification ID'
			});
		}

		const notification = await locals.notificationService.find(notificationId);
		if (!notification) {
			return fail(404, {
				message: 'Notification not found'
			});
		}

		if (notification.userId !== user.id) {
			return fail(403, {
				message: 'Forbidden'
			});
		}

		await locals.notificationService.archive(notificationId);

		return {
			success: true,
			message: 'Notification archived successfully'
		};
	}
};
