import type { Actions } from './$types';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { ContactUsEmail } from '@programmerbar/emails';
import { dev } from '$app/environment';

const PROGRAMMERBAR_EMAIL = 'styret@programmerbar.no';
const FROM_EMAIL = 'ikkesvar@programmer.bar';

const ContactUsSchema = zfd.formData({
	name: zfd.text(z.string().min(2).max(50)),
	email: zfd.text(z.string().email().min(3)),
	message: zfd.text(z.string().min(5).max(1000))
});

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await ContactUsSchema.parseAsync(await request.formData());

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
