import groq from 'groq';
import { sanity } from './client';
import { type Event } from '$lib/types';

export const getEvents = async () => {
	const query = groq`*[_type == "event" && start > now()] | order(start asc) {
        title,
		"slug": slug.current,
        start,
        end,
		isPrivate,
		registrationLink,
        body
    }`;

	return await sanity.fetch<Array<Event>>(query);
};

export const getEventBySlug = async (slug: string) => {
	const query = groq`*[_type == "event" && slug.current == $slug] {
		title,
		"slug": slug.current,
		start,
		end,
		isPrivate,
		registrationLink,
		body
	}[0]`;

	return await sanity.fetch<Event>(query, { slug });
};
