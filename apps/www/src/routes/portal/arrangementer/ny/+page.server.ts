import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const users = await locals.db.query.users
		.findMany({
			columns: {
				id: true,
				name: true
			}
		})
		.then((users) =>
			users.map((user) => ({
				label: user.name,
				value: user.id
			}))
		);

	return {
		users
	};
};
