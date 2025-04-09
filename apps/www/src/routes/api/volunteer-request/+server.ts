import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';
import { users } from '$lib/db/schemas';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const { name, email } = await request.json();

		if (!email.endsWith('@student.uib.no')) {
			return new Response(
				JSON.stringify({ error: 'Email must be a student email (@student.uib.no)' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const existingUser = await locals.db.query.users.findFirst({
			where: (row, { eq }) => eq(row.email, email.toLowerCase())
		});

		if (existingUser) {
			return new Response(JSON.stringify({ error: 'User already exists' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const userId = nanoid();
		const newUser = await locals.db
			.insert(users)
			.values({
				id: userId,
				name,
				email: email.toLowerCase(),
				role: 'normal'
			})
			.returning()
			.then((rows) => rows[0]);

		await locals.emailService.sendVolunteerRequestEmail({
			name,
			email
		});

		return new Response(JSON.stringify({ success: true, userId: newUser.id }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error processing volunteer request:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
