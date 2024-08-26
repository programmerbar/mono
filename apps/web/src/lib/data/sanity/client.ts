import { createClient } from '@sanity/client';

export const SANITY_PROJECT_ID = 'elfb3wn1';
export const SANITY_DATASET = 'production';

export const sanity = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: '2021-08-31',
	useCdn: true
});

export const ECHO_SANITY_PROJECT_ID = 'pgq2pd26';
export const ECHO_SANITY_DATASET = 'production';

export const echoSanity = createClient({
	projectId: ECHO_SANITY_PROJECT_ID,
	dataset: ECHO_SANITY_DATASET,
	apiVersion: '2021-08-31',
	useCdn: true
});
