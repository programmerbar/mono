import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const userId = params.id;

	if (!locals.user || locals.user.role !== 'board') {
		throw error(401, 'Unauthorized');
	}

	const user = await locals.userService.findById(userId);

	if (!user) {
		throw error(404, 'User not found');
	}

	const userShifts = await locals.shiftService.findCompletedShiftsByUserId(userId);
	const unclaimedBeers = await locals.beerService.getTotalAvailableBeers(userId);

	return json({
		...user,
		timesVolunteered: userShifts.length,
		unclaimedBeers: unclaimedBeers
	});
};
