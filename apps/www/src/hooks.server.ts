import type { Handle } from '@sveltejs/kit';
import { Resend } from 'resend';

export const handle: Handle = async ({ event, resolve }) => {
	const resend = new Resend(event.platform?.env.RESEND_API_KEY);
	event.locals.resend = resend;

	return resolve(event);
};
