import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, '/login');
	}

	const notifications = await locals.notificationService.getUnarchived(locals.user.id);

	return {
		notifications
	};
};
