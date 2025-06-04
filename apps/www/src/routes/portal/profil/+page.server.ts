import { fail, redirect } from '@sveltejs/kit';
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
		const data = await request.formData();
		const altEmail = data.get('altEmail') as string;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(altEmail)) {
			return fail(400, {
				success: false,
				message: 'Ugyldig e-postadresse',
				altEmail
			});
		}

		const success = await locals.userService.updateAltEmail(locals.user.id, altEmail);
		if (!success) {
			return fail(500, {
				success: false,
				message: 'Kunne ikke oppdatere e-postadresse',
				altEmail
			});
		}

		return {
			success: true,
			message: 'E-postadresse er oppdatert!'
		};
	}
};
