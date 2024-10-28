import { invitations } from '$lib/db/schema';
import { CreateInvitationSchema } from '$lib/validators';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response(null, { status: 401 });
	}

	const { email } = await request.json().then(CreateInvitationSchema.parse);

	const invitation = await locals.db
		.insert(invitations)
		.values({
			id: nanoid(),
			email,
			createdAt: new Date(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
		})
		.returning()
		.then((rows) => rows[0]);

	if (!invitation) {
		return new Response(null, { status: 500 });
	}

	return new Response(null, { status: 201 });
};
