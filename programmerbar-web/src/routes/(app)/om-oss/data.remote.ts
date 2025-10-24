import { prerender } from '$app/server';
import { echoSanityClient } from '$lib/api/sanity/client';
import { PROGRAMMERBAR_GROUP_QUERY, type StudentGroup } from '$lib/api/sanity/programmerbar';

export const getProgrammerbarGroup = prerender(async () => {
	return await echoSanityClient.fetch<StudentGroup>(PROGRAMMERBAR_GROUP_QUERY, {
		slug: 'programmerbar'
	});
});
