import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { user } = await parent();

	if (user.type !== 'admin') {
		redirect(302, '/portal');
	}

	const users = await locals.db.query.userTable.findMany({
		columns: {
			id: true,
			email: true,
			name: true,
			type: true
		}
	});

	return {
		user,
		users
	};
};
