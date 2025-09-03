import groq from 'groq';
import { echoSanityClient } from './client';

export type Happening = {
	_id: string;
	title: string;
	slug: string;
	date: string;
	_createdAt: string | null;
	registrationStart: string | null;
	body: string | null;
};

const getEventsQuery = groq`*[
	_type == "happening" &&
	!(_id in path("drafts.**")) &&
	"programmerbar" in organizers[]->slug.current &&
	date >= now()
] | order(date asc) {
	_id,
	title,
	"slug": slug.current,
	date,
	registrationStart,
	_createdAt,
	body
}[0...6]`;

export const getEvents = async () => {
	return await echoSanityClient.fetch<Array<Happening>>(getEventsQuery);
};

const getUpcomingEventsQuery = groq`*[
	_type == "happening" &&
	!(_id in path("drafts.**")) &&
	"programmerbar" in organizers[]->slug.current &&
	date > now()
] | order(date asc) {
	_id,
	title,
	"slug": slug.current,
	date,
	registrationStart,
	_createdAt,
	body
}`;

export const getUpcomingEvents = async () => {
	return await echoSanityClient.fetch<Array<Happening>>(getUpcomingEventsQuery);
};

export const getEventBySlugQuery = groq`*[
	_type == "happening" &&
	!(_id in path("drafts.**")) &&
	"programmerbar" in organizers[]->slug.current &&
	slug.current == $slug
] {
	_id,
	title,
	"slug": slug.current,
	date,
	registrationStart,
	_createdAt,
	body
}[0]`;

export const getEventBySlug = async (slug: string) => {
	return await echoSanityClient.fetch<Happening | null>(getEventBySlugQuery, { slug });
};

export type RepeatingEvent = {
	_id: string;
	title: string;
	dayOfWeek: number;
	startTime: string;
	endTime: string;
	startDate: string;
	endDate: string;
	ignoredDates: Array<string> | null;
	interval: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
	slug: string;
	_createdAt: string;
	body: string | null;
};

export const getRepeatingEventsQuery = groq`*[
	_type == "repeatingHappening" &&
	!(_id in path("drafts.**")) &&
	"programmerbar" in organizers[]->slug.current
] | order(date asc) {
	_id,
	title,
	dayOfWeek,
	startTime,
	endTime,
	startDate,
	ignoredDates,
	endDate,
	interval,
	_createdAt,
	"slug": slug.current,
	body
}`;

export const getRepeatingEvents = async () => {
	return await echoSanityClient.fetch<Array<RepeatingEvent>>(getRepeatingEventsQuery);
};

export const getRepeatingEventBySlugQuery = groq`*[
	_type == "repeatingHappening" &&
	!(_id in path("drafts.**")) &&
	"programmerbar" in organizers[]->slug.current &&
	slug.current == $slug
] {
	_id,
	title,
	dayOfWeek,
	startTime,
	endTime,
	startDate,
	ignoredDates,
	endDate,
	interval,
	_createdAt,
	"slug": slug.current,
	body
}[0]`;

export const getRepeatingEventBySlug = async (slug: string) => {
	return await echoSanityClient.fetch<RepeatingEvent | null>(getRepeatingEventBySlugQuery, {
		slug
	});
};
