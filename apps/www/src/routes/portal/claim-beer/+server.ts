import { json, error } from '@sveltejs/kit';

export async function POST({ locals }) {
	const userId = locals.user?.id;

	if (!userId) {
		throw error(401, 'Unauthorized: Please log in to claim your beer.');
	}

	try {
		const success = await locals.beerService.claimBeer(userId);
		if (success) {
			return json({ success: true });
		} else {
			return json({ message: 'No more beers left to claim.' }, { status: 400 });
		}
	} catch (err) {
		console.error('Error claiming beer:', err);
		throw error(500, 'Server encountered an unexpected issue.');
	}
}
