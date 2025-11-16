import { getEventBySlug, getRepeatingEventBySlug, type Happening } from '$lib/api/sanity/echo-cms';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getNextOccurrence } from '$lib/utils/events';

export const load: PageServerLoad = async ({ params, locals }) => {
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
				_createdAt: repeatingEvent._createdAt,
				startTime: repeatingEvent.startTime
			} satisfies Happening & { startTime?: string | { hour: number; minute: number } }
		};
	}

	const dbEvent = await locals.eventService.getPublicEventBySlug(params.slug);
	if (dbEvent) {
		return {
			event: dbEvent
		};
	}

	throw error(404, 'Event not found');
};
