import type { Actions } from './$types';
import { ContactUsSchema } from '$lib/validators';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request, getClientAddress }) => {
		const ip = getClientAddress();
		const formData = await request.formData();

		const name = formData.get('name');
		const email = formData.get('email');

		if (name || email) {
			await locals.banService.banIp(ip);
			return fail(400, { success: false });
		}

		const { data, success } = ContactUsSchema.safeParse(formData);

		if (!success) {
			console.error('Validation failed:', data);
			return fail(400, { success: false, error: 'Invalid input' });
		}

		// Save to database
		await locals.contactSubmissionService.create({
			name: data.namekjkj,
			email: data.emailkjkj,
			message: data.messagekjkj,
			ipAddress: ip
		});

		await locals.notificationService.notifyContactSubmission(
			data.namekjkj,
			data.emailkjkj,
			data.messagekjkj
		);

		try {
			await locals.emailService.sendContactUsEmail({
				name: data.namekjkj,
				email: data.emailkjkj,
				message: data.messagekjkj
			});

			return { success: true };
		} catch (error) {
			console.error('Failed to send email:', error);
			return fail(500, { success: false, error: 'Failed to send email' });
		}
	}
};
