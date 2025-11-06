import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const response = await fetch('https://naas.isalman.dev/no');

		if (!response.ok) {
			return json({ error: 'Failed to fetch rejection reason' }, { status: response.status });
		}

		const data = await response.json();

		// Add CORS headers to allow frontend to access this endpoint
		return json(data, {
			headers: {
				'Cache-Control': 'public, max-age=60'
			}
		});
	} catch (error) {
		console.error('Error fetching from naas.isalman.dev:', error);
		return json({ error: 'Failed to fetch rejection reason' }, { status: 500 });
	}
};
