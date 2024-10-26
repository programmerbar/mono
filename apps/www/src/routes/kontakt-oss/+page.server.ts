import type { Actions } from './$types';
import { ContactUsEmail } from '@programmerbar/emails';
import { dev } from '$app/environment';
import { ContactUsSchema } from '$lib/validators';

const PROGRAMMERBAR_EMAIL = 'styret@programmerbar.no';
const FROM_EMAIL = 'ikkesvar@programmer.bar';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData().then(ContactUsSchema.parse);

		if (dev) {
			console.log(data);
			return { success: true };
		}

		await locals.resend.emails.send({
			from: FROM_EMAIL,
			subject: 'Kontaktskjema på hjemmesiden',
			to: [PROGRAMMERBAR_EMAIL],
			react: ContactUsEmail(data)
		});

		return { success: true };
	}
};
