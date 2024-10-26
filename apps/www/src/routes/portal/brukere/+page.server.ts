import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const users = await locals.db.query.users.findMany();

	return {
		users
	};
};
