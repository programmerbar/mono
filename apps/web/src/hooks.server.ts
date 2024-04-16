import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { Resend } from 'resend';

const getResendClient = (apiKey: string | null) => {
	if (!apiKey) {
		return null;
	}

	return new Resend(apiKey);
};

const setup: Handle = ({ event, resolve }) => {
	event.locals.resend = getResendClient(event.platform?.env.RESEND_API_KEY ?? null);

	return resolve(event);
};

export const handle = sequence(setup);
