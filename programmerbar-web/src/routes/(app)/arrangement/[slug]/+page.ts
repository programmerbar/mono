import { getEventBySlug, getRepeatingEventBySlug, type Happening } from '$lib/api/sanity/events';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getNextOccurrence } from '$lib/repeating-events';

export const load: PageLoad = async ({ params }) => {
	const event = await getEventBySlug(params.slug);

	if (event) {
		return {
			event
		};
	}

	const repeatingEvent = await getRepeatingEventBySlug(params.slug);
	if (repeatingEvent) {
		const next = getNextOccurrence(repeatingEvent);
		return {
			event: {
				_id: repeatingEvent._id,
				body: repeatingEvent.body,
				date: next.toISOString(),
				slug: repeatingEvent.slug,
				title: repeatingEvent.title,
				registrationStart: null,
				_createdAt: repeatingEvent._createdAt
			} satisfies Happening
		};
	}

	throw error(404, 'Event not found');
};
