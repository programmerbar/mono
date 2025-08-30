import { command, getRequestEvent } from '$app/server';
import { z } from 'zod';

const TrimmedEmailSchema = z.email().transform((email) => email.toLowerCase().trim());

export const sendInvitationEmail = command(TrimmedEmailSchema, async (email) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return false;
	}

	await locals.invitationService.invite(email);
	await locals.emailService.sendInvitaitonEmail({ email });

	return true;
});
