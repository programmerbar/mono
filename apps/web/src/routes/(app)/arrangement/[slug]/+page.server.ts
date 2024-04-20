import { getEventBySlug } from '$lib/data/sanity/events';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	const event = await getEventBySlug(slug);

	if (!event) {
		throw error(404, 'Event not found');
	}

	return {
		event
	};
};
