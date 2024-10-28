import { CreateInvitationSchema } from '$lib/validators';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response(null, { status: 401 });
	}

	const { email } = await request.json().then(CreateInvitationSchema.parse);

	const invitation = await locals.invitationService.invite(email);

	if (!invitation) {
		return new Response(null, { status: 500 });
	}

	await locals.emailService.sendInvitaitonEmail({ email });

	return new Response(null, { status: 201 });
};
