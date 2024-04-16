import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { Resend } from 'resend';

const setup: Handle = ({ event, resolve }) => {
	event.locals.resend = new Resend(event.platform?.env.RESEND_API_KEY);

	return resolve(event);
};

export const handle = sequence(setup);
