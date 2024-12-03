import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user || locals.user.role !== 'board') {
		throw redirect(303, '/portal');
	}

	const users = await locals.userService.findAll();

	return {
		user: locals.user,
		users
	};
};
