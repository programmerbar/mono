import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();
	const { notifications } = parentData;

	return {
		notifications
	};
};
