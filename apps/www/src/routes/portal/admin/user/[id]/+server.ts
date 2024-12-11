import { json, error } from '@sveltejs/kit';

interface BeerUpdateData {
  additionalBeers: number;
}

export async function GET({ params, locals }: { params: { id: string }; locals: App.Locals }) {
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
}

export async function POST({ params, request, locals }: { params: { id: string }; request: Request; locals: App.Locals }) {
  const userId = params.id;

  if (!locals.user || locals.user.role !== 'board') {
    throw error(401, 'Unauthorized');
  }

  try {
    const data = (await request.json()) as BeerUpdateData;
    const newBeerCount = Number(data.additionalBeers);

    if (!Number.isInteger(newBeerCount) || newBeerCount < 0) {
      throw error(400, 'Invalid additional beer count');
    }

    const success = await locals.beerService.updateBeers(userId, newBeerCount);

    if (success) {
      return json({ success: true });
    } else {
      throw error(500, 'Failed to update additional beers');
    }
  } catch (err) {
    console.error('Error updating additional beers:', err);
    throw error(500, 'Server error');
  }
}
