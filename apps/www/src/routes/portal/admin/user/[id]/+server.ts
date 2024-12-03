import { json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
	const userId = params.id;

	if (!locals.user || locals.user.role !== 'board') {
		return new Response(null, { status: 401 });
	}

	const user = await locals.userService.findById(userId);

	if (!user) {
		return new Response(null, { status: 404 });
	}

	const userShifts = await locals.shiftService.findCompletedShiftsByUserId(userId);
	const unclaimedBeers = await locals.shiftService.findShiftsWithUnclaimedBeersByUserId(userId);

	Object.defineProperties(user, {
		timesVolunteered: {
			value: userShifts.length,
			enumerable: true
		},
		unclaimedBeers: {
			value: unclaimedBeers.length,
			enumerable: true
		}
	});

	return json(user);
}
