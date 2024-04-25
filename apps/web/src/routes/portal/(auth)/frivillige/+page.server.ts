import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { user } = await parent();

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
