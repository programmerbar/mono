import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

export const POST: RequestHandler = async ({ locals }) => {
	if (!dev) {
		return error(404, 'Not found');
	}

	if (!locals.user) {
		return error(401, 'Not authenticated');
	}

	try {
		// Send a test notification
		await locals.notificationService.create(
			locals.user.id,
			'Test Push Notification 🔔',
			'Dette er en test-notifikasjon fra Programmerbar! Hvis du ser dette, fungerer push-varsler! 🎉'
		);

		return json({
			success: true,
			message: 'Test notification sendt!'
		});
	} catch (err) {
		console.error('Failed to send test notification:', err);
		return error(500, 'Something went wrong');
	}
};
