import { CreateEmailShiftSchema } from '$lib/validators';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response(null, { status: 401 });
	}

	const shiftEmailData = await request
		.json()
		.then(CreateEmailShiftSchema.parse)
		.then((data) => data.email.toLowerCase());

	await locals.emailShiftService.create(shiftEmailData);
	await locals.emailService.sendShiftEmail(shiftEmailData);

	return new Response(null, { status: 201 });
};
