import { CreateInvitationSchema } from '$lib/validators';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response(null, { status: 401 });
	}

	const json = await request.json();

	const { data, success } = CreateInvitationSchema.safeParse(json);

	if (!success) {
		return new Response(JSON.stringify(data), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const email = data.email.toLowerCase().trim();

	await locals.invitationService.invite(email);
	await locals.emailService.sendInvitaitonEmail({ email });

	return new Response(null, { status: 201 });
};
