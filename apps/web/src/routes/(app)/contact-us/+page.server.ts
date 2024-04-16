import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
// @ts-expect-error React component
import ContactUs from '@programmerbar/email/contact-us';
import { dev } from '$app/environment';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const { name, email, message, subject } = Object.fromEntries(formData) as {
			name: string;
			email: string;
			message: string;
			subject: string;
		};

		// Honey pot
		if (subject !== '') {
			throw error(400, 'Bad request');
		}

		if (!name || !email || !message) {
			throw error(400, 'Bad request');
		}

		if (locals.resend) {
			await locals.resend.emails.send({
				from: 'ikkesvar@echo-webkom.no',
				subject: 'Kontaktskjema på hjemmesiden',
				to: ['hei@programmerbar.no'],
				react: ContactUs({
					name,
					email,
					message
				})
			});
		} else {
			console.log('Sending email', {
				name,
				email,
				message
			});
		}

		return {
			success: true
		};
	}
};
