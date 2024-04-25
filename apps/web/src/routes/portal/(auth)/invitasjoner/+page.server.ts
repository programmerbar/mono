import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { invitationTable } from '$lib/server/db/schema';
import { createInvitationId } from '$lib/id';
import { eq } from 'drizzle-orm';
import { BASE_URL } from '$lib/utils/base-url';
// @ts-expect-error React
import InvitationEmail from '@programmerbar/email/contact-us';

export const load: PageServerLoad = async ({ locals, depends, parent }) => {
	depends('invitations');

	const { user } = await parent();

	if (user.type !== 'admin') {
		redirect(302, '/portal');
	}

	const invitations = await locals.db.query.invitationTable.findMany();

	return {
		user,
		invitations
	};
};

export const actions: Actions = {
	sendInvitation: async ({ locals, request }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;

		if (!email || !email.includes('@') || !email.includes('.')) {
			return { success: false, errors: { email: ['Email is required'] } };
		}

		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week

		const id = createInvitationId();
		await locals.db.insert(invitationTable).values({
			id,
			email,
			expiresAt,
			createdAt: new Date()
		});

		const invitationUrl = new URL(BASE_URL + '/invitasjon');
		invitationUrl.searchParams.set('code', id);

		if (locals.resend) {
			locals.resend.emails.send({
				from: 'ikkesvar@echo-webkom.no',
				subject: 'Invitasjon til programmer.bar',
				to: [email],
				react: InvitationEmail({
					link: invitationUrl.toString()
				})
			});
		} else {
			console.log('Email not sent');
			console.log('Email:', email);
			console.log('Link:', invitationUrl.toString());
		}

		return { success: true, errors: [] };
	},
	removeInvitation: async ({ locals, request }) => {
		const formData = await request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return { success: false, errors: { id: ['ID is required'] } };
		}

		await locals.db.delete(invitationTable).where(eq(invitationTable.id, id));

		return { success: true, errors: [] };
	}
};
