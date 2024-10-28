import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [users, invitations] = await Promise.all([
		locals.db.query.users.findMany(),
		locals.db.query.invitations.findMany({
			where: (row, { isNull }) => isNull(row.usedAt)
		})
	]);

	return {
		users,
		invitations
	};
};
