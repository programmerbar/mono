import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;

	if (user) {
		redirect(302, '/portal/hjem');
	}

	return {};
};
