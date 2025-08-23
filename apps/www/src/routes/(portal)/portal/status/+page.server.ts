import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const status = await locals.statusService.get();

	return {
		status
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const status = Number(formData.get('status'));
		const isValidStatus = [0, 1, 2].includes(status);

		if (!isValidStatus) {
			return fail(400, {
				message: 'Invalid status'
			});
		}

		await locals.statusService.set(status);

		return {
			success: true
		};
	}
};
