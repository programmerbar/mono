import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals, depends }) => {
	depends('shifts');

	const { user } = await parent();

	const shifts = await locals.db.query.shiftTable.findMany({
		with: {
			members: {
				with: {
					user: true
				}
			}
		}
	});

	return {
		user,
		shifts
	};
};
