import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, '/login');
	}
	const user = await locals.userService.findById(locals.user.id);
	const userShifts = await locals.shiftService.findCompletedShiftsByUserId(locals.user.id);
	const unclaimedBeers = await locals.beerService.getTotalAvailableBeers(locals.user.id);
	const referrals = await locals.referralService.getReferralStats(locals.user.id);
	const shifts = await locals.shiftService.findUpcomingShiftsByUserId(locals.user.id);

	return {
		user,
		timesVolunteered: userShifts.length,
		unclaimedBeers,
		referrals,
		shifts
	};
};
