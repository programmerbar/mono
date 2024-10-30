import { UserService } from '$lib/services/user.service';
import { json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
	const userId = params.id;

	if (!locals.user || locals.user.role !== 'board') {
		return new Response(null, { status: 401 });
	}

	const userService = new UserService(locals.db);
	const user = await userService.findById(userId);

	if (user) {
		const userShifts = await locals.shiftService.findCompletedShiftsByUserId(userId);

		const unclaimedBeers = await locals.shiftService.findShiftsWithUnclaimedBeersByUserId(userId);

		user.timesVolunteered = userShifts.length;
		user.unclaimedBeers = unclaimedBeers.length;

		return json(user);
	} else {
		return new Response(null, { status: 404 });
	}
}
