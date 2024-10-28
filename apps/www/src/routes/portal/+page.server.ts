import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, '/login');
	}

	const [userShifts, unclaimedBeers, upcomingShifts] = await Promise.all([
		locals.shiftService.findCompletedShiftsByUserId(locals.user.id),
		locals.shiftService.findShiftsWithUnclaimedBeersByUserId(locals.user.id),
		locals.shiftService.findUpcomingShiftsByUserId(locals.user.id)
	]);

	return {
		shiftsCompleted: userShifts.length,
		unclaimedBeers: unclaimedBeers.length,
		upcomingShifts
	};
};
