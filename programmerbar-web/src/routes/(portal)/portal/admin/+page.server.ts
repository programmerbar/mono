import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'board') {
		throw redirect(303, '/portal');
	}

	const users = await locals.userService.findAll();
	const tags = await locals.tagService.getAllTags();

	return {
		user: locals.user,
		users,
		showInitializeTags: tags.length === 0
	};
};

export const actions: Actions = {
	initializeTags: async ({ locals }) => {
		if (!locals.user || locals.user.role !== 'board') {
			return fail(401, { message: 'Unauthorized' });
		}

		const success = await locals.tagService.initializeDefaultTags();
		if (!success) {
			return fail(400, { message: 'Failed to initialize tags' });
		}

		const tags = await locals.tagService.getAllTags();
		const devTag = tags.find((tag) => tag.name === 'Dev');

		if (devTag) {
			await locals.tagService.assignTagToUser(devTag.id, locals.user.id, locals.user.id);
		}

		return { success: true, message: 'Tags initialized successfully' };
	}
};
