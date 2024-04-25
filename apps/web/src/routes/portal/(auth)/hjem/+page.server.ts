import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { user } = await parent();

	const shifts = await locals.db.query.usersToShiftsTable.findMany({
		where: (shift, { eq }) => eq(shift.userId, user.id),
		with: {
			shift: {
				with: {
					members: {
						with: {
							user: true
						}
					}
				}
			}
		}
	});

	return {
		user,
		shifts
	};
};
