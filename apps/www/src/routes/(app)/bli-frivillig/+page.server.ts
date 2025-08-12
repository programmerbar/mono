import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/portal');
	}
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		try {
			const formData = await request.formData();
			const name = formData.get('name') as string;
			const email = formData.get('email') as string;

			if (!email.endsWith('@student.uib.no')) {
				return fail(400, {
					success: false,
					error: 'E-postadressen må være en student.uib.no-adresse.'
				});
			}

			await locals.emailService.sendVolunteerRequestEmail({
				name,
				email
			});

			return { success: true };
		} catch (error) {
			console.error('Error processing volunteer request:', error);

			return fail(500, {
				success: false,
				error: 'Noe gikk galt. Prøv igjen senere.'
			});
		}
	}
};
