import { StatusService } from '$lib/server/services/status.service';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const status = await locals.statusService.get();
	const message = StatusService.getMessage(status);

	return new Response(JSON.stringify({ status, message }), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=60'
		}
	});
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const json = await request.json();
	const { data, success } = StatusService.validateStatus(json);

	if (!success) {
		return new Response(null, {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	await locals.statusService.set(data.status);

	return new Response(null, { status: 204 });
};
