import groq from "groq";
import { sanityClient } from "sanity:client";
import type {
  GetEventBySlugQueryResult,
  GetEventsQueryResult,
  GetUpcomingEventsQueryResult,
} from "../../../../sanity.types";

const getEventsQuery = groq`*[_type == "event" && !(_id in path("drafts.**"))] | order(start desc) {
	_id,
	title,
	"slug": slug.current,
	start,
	end,
	isPrivate,
	registrationLink,
	body
}`;

export const getEvents = async () => {
  return await sanityClient.fetch<GetEventsQueryResult>(getEventsQuery);
};

const getUpcomingEventsQuery = groq`*[_type == "event" && !(_id in path("drafts.**")) && start > now()] | order(start asc) {
	_id,
    title,
	"slug": slug.current,
    start,
    end,
	isPrivate,
	registrationLink,
    body
}`;

export const getUpcomingEvents = async () => {
  return await sanityClient.fetch<GetUpcomingEventsQueryResult>(getUpcomingEventsQuery);
};

export const getEventBySlugQuery = groq`*[_type == "event" && !(_id in path("drafts.**")) && slug.current == $slug] {
	_id,
	title,
	"slug": slug.current,
	start,
	end,
	isPrivate,
	registrationLink,
	body
}[0]`;

export const getEventBySlug = async (slug: string) => {
  return await sanityClient.fetch<GetEventBySlugQueryResult>(getEventBySlugQuery, { slug });
};
