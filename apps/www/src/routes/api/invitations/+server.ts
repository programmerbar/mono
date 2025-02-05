import { CreateInvitationSchema } from '$lib/validators';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response(null, { status: 401 });
	}

	const email = await request
		.json()
		.then(CreateInvitationSchema.parse)
		.then((data) => data.email.toLowerCase());

	await locals.invitationService.invite(email);
	await locals.emailService.sendInvitaitonEmail({ email });

	return new Response(null, { status: 201 });
};
