import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = locals;

	if (!user) {
		throw redirect(302, '/portal');
	}

	return {
		user
	};
};
