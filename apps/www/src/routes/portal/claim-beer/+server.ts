import { json, fail } from '@sveltejs/kit';

export async function POST({ locals }) {
	const userId = locals.user?.id;

	if (!userId) {
		return fail(401, { error: 'Unauthorized: Please log in to claim your beer.' });
	}

	try {
		const success = await locals.beerService.claimBeer(userId);
		if (success) {
			return json({ success: true });
		} else {
			return json({ message: '' }, { status: 400 });
		}
	} catch (err) {
		console.error('Error claiming beer:', err);
		return json({ message: 'Server encountered an unexpected issue.' }, { status: 500 });
	}
}
