import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, '/login');
	}

	const notifications = await locals.notificationService.getUnarchived(locals.user.id);

	const pendingApplicationsCount =
		locals.user.role === 'board' ? await locals.pendingApplicationService.getCount() : 0;

	const canManageTagOptions =
		locals.user.role === 'board'
			? await locals.tagService.canManageTagOptions(locals.user.id)
			: false;

	return {
		notifications,
		pendingApplicationsCount,
		canManageTagOptions
	};
};
