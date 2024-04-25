import groq from 'groq';
import { sanity } from './client';
import { type Event } from '$lib/types';

export const getEvents = async () => {
	const query = groq`*[_type == "event" && !(_id in path("drafts.**"))] | order(start desc) {
		_id,
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

export const getUpcomingEvents = async () => {
	const query = groq`*[_type == "event" && !(_id in path("drafts.**")) && start > now()] | order(start asc) {
		_id,
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
	const query = groq`*[_type == "event" && !(_id in path("drafts.**")) && slug.current == $slug] {
		_id,
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
