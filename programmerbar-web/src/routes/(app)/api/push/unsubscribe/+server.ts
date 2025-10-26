import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	try {
		const { endpoint } = (await request.json()) as { endpoint: string };

		if (!endpoint) {
			return error(400, 'Endpoint is required');
		}

		await locals.pushSubscriptionService.unsubscribe(endpoint);

		return json({
			success: true
		});
	} catch (err) {
		console.error('Failed to remove push subscription:', err);
		return error(500, 'Failed to remove subscription');
	}
};
