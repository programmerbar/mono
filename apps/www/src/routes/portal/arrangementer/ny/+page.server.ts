import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const users = await locals.userService.findAll().then((users) =>
		users.map((user) => ({
			label: user.name,
			value: user.id
		}))
	);

	return {
		users
	};
};
