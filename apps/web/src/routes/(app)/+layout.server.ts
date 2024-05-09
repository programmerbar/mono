import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ platform }) => {
	const banner = await platform?.env.KV.get('banner');

	return {
		banner
	};
};
