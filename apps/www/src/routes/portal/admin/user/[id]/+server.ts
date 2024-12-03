import { json, fail } from '@sveltejs/kit';

export async function GET({ params, locals }) {
	const userId = params.id;

	if (!locals.user || locals.user.role !== 'board') {
		throw fail(401, { error: 'Unauthorized' });
	}

	const user = await locals.userService.findById(userId);

	if (!user) {
		throw fail(404, { eroor: 'User not found' });
	}

	const userShifts = await locals.shiftService.findCompletedShiftsByUserId(userId);
	const unclaimedBeers = await locals.beerService.getTotalAvailableBeers(userId);

	return json({
		...user,
		timesVolunteered: userShifts.length,
		unclaimedBeers: unclaimedBeers
	});
}

export async function POST({ params, request, locals }) {
	const userId = params.id;

	if (!locals.user || locals.user.role !== 'board') {
		throw fail(401, { error: 'Unauthorized' });
	}

	try {
		const data = await request.json();
		const newBeerCount = Number(data.additionalBeers);

		if (!Number.isInteger(newBeerCount) || newBeerCount < 0) {
			throw fail(400, { error: 'Invalid additional beer count' });
		}

		const success = await locals.beerService.updateBeers(userId, newBeerCount);

		if (success) {
			return json({ success: true });
		} else {
			throw fail(500, { error: 'Failed to update additional beers' });
		}
	} catch (err) {
		console.error('Error updating additional beers:', err);
		throw fail(500, { error: 'Server error' });
	}
}
