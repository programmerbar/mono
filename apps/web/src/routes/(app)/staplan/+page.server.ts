import type { PageServerLoad } from './$types';
import { getStandPlan } from '$lib/data/sanity/stand-plan';

export const load: PageServerLoad = async () => {
	const standPlan = await getStandPlan();

	return {
		standPlan
	};
};
