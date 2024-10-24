import { getEventBySlug } from '$lib/api/sanity/events';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const event = await getEventBySlug(params.slug);

	if (!event) {
		throw error(404, 'Event not found');
	}

	return {
		event
	};
};
