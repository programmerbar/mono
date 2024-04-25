import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { user } = await parent();

	const upcomingShifts = await locals.db.query.shiftTable.findMany({
		where: (shift, { and, gte, eq }) => and(gte(shift.start, new Date())),
		with: {
			members: true
		}
	});

	return {
		user,
		upcomingShifts
	};
};
