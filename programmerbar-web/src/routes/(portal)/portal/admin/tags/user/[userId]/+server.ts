import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	const user = locals.user;
	if (!user || user.role !== 'board') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const { userId } = params;
	if (!userId) {
		return json({ error: 'User ID is required' }, { status: 400 });
	}

	try {
		const userTags = await locals.tagService.getUserTags(userId);
		return json(userTags);
	} catch {
		return json({ error: 'Failed to get user tags' }, { status: 500 });
	}
};
