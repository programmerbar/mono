import { getProgrammerbarGroup } from '$lib/api/sanity/programmerbar';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const programmerbar = await getProgrammerbarGroup();

	return {
		programmerbar
	};
};
