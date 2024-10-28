import type { Actions } from './$types';
import { ContactUsSchema } from '$lib/validators';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData().then(ContactUsSchema.parse);

		await locals.emailService.sendContactUsEmail(data);

		return { success: true };
	}
};
