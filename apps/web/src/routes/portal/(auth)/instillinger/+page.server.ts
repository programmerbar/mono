import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { mutateStatus } from '$lib/data/api';
import { privateDecrypt } from 'crypto';

export const load: PageServerLoad = async ({ platform, parent }) => {
	const { user } = await parent();

	if (user.type !== 'admin') {
		redirect(302, '/portal');
	}

	const banner = (await platform?.env.KV.get('banner')) || '';

	return {
		user,
		banner
	};
};

export const actions: Actions = {
	setBanner: async ({ request, platform }) => {
		const formData = await request.formData();

		const banner = formData.get('banner') as string;

		if (!banner) {
			await platform?.env.KV.delete('banner');
		} else {
			await platform?.env.KV.put('banner', banner);
		}

		return {
			success: true,
			message: 'Banner oppdatert!'
		};
	},

	clear: async ({ platform }) => {
		await platform?.env.KV.delete('banner');

		return {
			success: true,
			message: 'Banner fjernet!'
		};
	},

	close: async () => {
		await mutateStatus(0);
	},

	open: async () => {
		await mutateStatus(1);
	},

	private: async () => {
		await mutateStatus(2);
	}
};
