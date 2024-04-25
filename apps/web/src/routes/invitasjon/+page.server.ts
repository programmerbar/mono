import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		throw error(404, 'Not found');
	}

	const invitation = await locals.db.query.invitationTable.findFirst({
		where: (invitation, { eq }) => eq(invitation.id, code)
	});

	if (!invitation) {
		throw error(404, 'Not found');
	}

	return {
		invitation
	};
};

export const actions: Actions = {
	acceptInvitation: async ({ locals, request, cookies }) => {
		const formData = await request.formData();
		const code = formData.get('code') as string;

		if (!code) {
			return { success: false, errors: { code: ['Code is required'] } };
		}

		const invitation = await locals.db.query.invitationTable.findFirst({
			where: (invitation, { eq }) => eq(invitation.id, code)
		});

		if (!invitation) {
			return { success: false, errors: { code: ['Invalid code'] } };
		}

		cookies.set('invitation', code, {
			path: '/',
			maxAge: invitation.expiresAt.getTime() - Date.now()
		});

		throw redirect(302, '/feide');
	}
};
