import { createClient } from '@sanity/client';

export const SANITY_PROJECT_ID = 'elfb3wn1';
export const SANITY_DATASET = 'production';

export const sanityClient = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: '2021-08-31',
	useCdn: true
});
