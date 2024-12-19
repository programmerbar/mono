import type { Actions } from './$types';
import { ContactUsSchema } from '$lib/validators';

export const actions: Actions = {
	default: async ({ locals, request, getClientAddress }) => {
		const ip = getClientAddress();
		const formData = await request.formData();

		const name = formData.get('name');
		const email = formData.get('email');

		if (name || email) {
			await locals.banService.banIp(ip);
			return { success: false };
		}

		const data = ContactUsSchema.parse(formData);

		await locals.emailService.sendContactUsEmail({
			name: data.namekjkj,
			email: data.emailkjkj,
			message: data.messagekjkj
		});

		return { success: true };
	}
};
