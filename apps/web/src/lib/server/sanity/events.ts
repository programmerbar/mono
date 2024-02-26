import groq from 'groq';
import { sanity } from './client';

export type Event = {
	title: string;
	start: string;
	end: string;
	body: string | null;
};

export const getEvents = async () => {
	const query = groq`*[_type == "event"] | order(start asc) {
        title,
        start,
        end,
        body
    }`;

	return await sanity.fetch<Array<Event>>(query);
};
