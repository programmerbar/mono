import { fail, redirect } from '@sveltejs/kit';
import { isValidEmail } from '$lib/validators';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, '/login');
	}
	const user = await locals.userService.findById(locals.user.id);
	return {
		user
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(307, '/login');
		}
		const userId = locals.user.id;
		const data = await request.formData();
		const altEmail = data.get('altEmail') as string;
		const phone = data.get('phone') as string;

		if (altEmail) {
			if (!isValidEmail(altEmail)) {
				return fail(400, {
					success: false,
					message: 'Ugyldig e-postadresse',
					altEmail
				});
			}

			const mail = await locals.userService.updateAltEmail(userId, altEmail);

			if (!mail) {
				return fail(500, {
					success: false,
					message: 'Kunne ikke oppdatere e-postadresse',
					altEmail
				});
			}
		}

		if (phone) {
			await locals.userService.updatePhone(userId, phone);
		}
		return {
			success: true,
			message: 'Bruker er oppdatert!'
		};
	}
};
