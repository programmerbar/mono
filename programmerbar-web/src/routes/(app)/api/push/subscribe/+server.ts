import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	try {
		const subscription = (await request.json()) as {
			endpoint: string;
			keys: { p256dh: string; auth: string };
		};

		if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
			return error(400, 'Invalid subscription object');
		}

		const savedSubscription = await locals.pushSubscriptionService.subscribe(
			locals.user.id,
			subscription
		);

		return json({
			success: true,
			subscription: savedSubscription
		});
	} catch (err) {
		console.error('Failed to save push subscription:', err);
		return error(500, 'Failed to save subscription');
	}
};
