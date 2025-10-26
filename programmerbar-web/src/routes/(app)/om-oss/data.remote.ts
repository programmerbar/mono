import { prerender } from '$app/server';
import {
	echoSanityClient,
	PROGRAMMERBAR_GROUP_QUERY,
	type StudentGroup
} from '$lib/api/sanity/echo-cms';

export const getProgrammerbarGroup = prerender(async () => {
	return await echoSanityClient.fetch<StudentGroup>(PROGRAMMERBAR_GROUP_QUERY, {
		slug: 'programmerbar'
	});
});
