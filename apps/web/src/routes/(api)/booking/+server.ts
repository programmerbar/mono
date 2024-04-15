import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	throw redirect(302, 'https://forms.gle/BLdygdoRJgjMbQZj6');
};
