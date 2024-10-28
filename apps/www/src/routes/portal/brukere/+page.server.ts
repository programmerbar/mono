import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [users, invitations] = await Promise.all([
		locals.userService.findAll(),
		locals.invitationService.findAllUnused()
	]);

	return {
		users,
		invitations
	};
};
