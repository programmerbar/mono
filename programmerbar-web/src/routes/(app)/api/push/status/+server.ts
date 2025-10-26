import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	try {
		const subscriptions = await locals.pushSubscriptionService.getByUserId(locals.user.id);

		return json({
			subscribed: subscriptions.length > 0,
			subscriptionCount: subscriptions.length,
			subscriptions: subscriptions.map((sub) => ({
				id: sub.id,
				endpoint: sub.endpoint,
				createdAt: sub.createdAt,
				lastUsedAt: sub.lastUsedAt
			}))
		});
	} catch (err) {
		console.error('Failed to get push subscription status:', err);
		return error(500, 'Failed to get subscription status');
	}
};
