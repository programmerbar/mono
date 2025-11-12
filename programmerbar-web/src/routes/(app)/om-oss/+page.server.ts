import {
	echoSanityClient,
	PROGRAMMERBAR_GROUP_QUERY,
	type StudentGroup
} from '$lib/api/sanity/echo-cms';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const programmerbar = await echoSanityClient.fetch<StudentGroup>(PROGRAMMERBAR_GROUP_QUERY, {
		slug: 'programmerbar'
	});

	const html = await marked.parse(programmerbar.description);

	return {
		programmerbar,
		html
	};
};
