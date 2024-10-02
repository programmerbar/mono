import groq from "groq";
import { echoSanityClient } from "./client";

export type Happening = {
  _id: string;
  title: string;
  slug: string;
  date: string;
  registrationStart: string | null;
  body: string | null;
};

const getEventsQuery = groq`*[
	_type == "happening" &&
	!(_id in path("drafts.**")) &&
	"programmerbar" in organizers[]->slug.current
] | order(date desc) {
	_id,
	title,
	"slug": slug.current,
	date,
	registrationStart,
	body
}`;

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
    body
}[0]`;

export const getEventBySlug = async (slug: string) => {
  return await echoSanityClient.fetch<Happening | null>(getEventBySlugQuery, { slug });
};
