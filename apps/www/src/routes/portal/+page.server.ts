import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, '/login');
	}

	const [userShifts, upcomingShifts] = await Promise.all([
		locals.shiftService.findCompletedShiftsByUserId(locals.user.id),
		locals.shiftService.findUpcomingShiftsByUserId(locals.user.id)
	]);

	return {
		shiftsCompleted: userShifts.length,
		upcomingShifts
	};
};
