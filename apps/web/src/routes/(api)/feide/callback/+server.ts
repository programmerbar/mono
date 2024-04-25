import { createUserId } from '$lib/id.js';
import { getFeideUser } from '$lib/server/auth/providers/feide';
import { invitationTable } from '$lib/server/db/schema';
import { userTable } from '$lib/server/db/schema/users.js';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';

export const GET = async ({ locals, cookies, url }) => {
	const stateCookie = cookies.get('oauth_state');

	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	if (!state || !stateCookie || !code || stateCookie !== state) {
		return new Response('Invalid state', { status: 400 });
	}

	const invitationId = cookies.get('invitation');

	const invitation =
		(invitationId
			? await locals.db.query.invitationTable.findFirst({
					where: (invitation, { eq }) => eq(invitation.id, invitationId)
				})
			: null) ?? null;

	try {
		const tokens = await locals.feide.validateAuthorizationCode(code);
		const providerUser = await getFeideUser(tokens.accessToken);

		const existingUser = await locals.db.query.userTable.findFirst({
			where: (user, { eq }) => eq(user.feideId, providerUser.id)
		});

		if (!existingUser && !invitation) {
			return new Response('User not found', { status: 404 });
		}

		if (!existingUser && invitation) {
			if (invitation.redeemedAt) {
				return new Response('Invitation already redeemed', { status: 400 });
			}

			const userId = createUserId();
			await locals.db.insert(userTable).values({
				id: userId,
				email: invitation.email,
				feideId: providerUser.id,
				name: providerUser.name,
				type: 'user'
			});

			await locals.db
				.update(invitationTable)
				.set({
					redeemedAt: new Date()
				})
				.where(eq(invitationTable.id, invitation.id));

			const session = await locals.lucia.createSession(userId, {});
			const { name, value, attributes } = locals.lucia.createSessionCookie(session.id);

			cookies.set(name, value, {
				...attributes,
				path: '/'
			});
		} else if (existingUser) {
			const session = await locals.lucia.createSession(existingUser.id, {});
			const { name, value, attributes } = locals.lucia.createSessionCookie(session.id);

			cookies.set(name, value, {
				...attributes,
				path: '/'
			});
		} else {
			return new Response('Internal server error', { status: 500 });
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (error) {
		console.log(error);

		if (error instanceof OAuth2RequestError) {
			return new Response('Invalid code', { status: 400 });
		}

		return new Response('Internal server error', { status: 500 });
	}
};
