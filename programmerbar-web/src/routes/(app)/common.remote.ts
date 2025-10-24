import { form, getRequestEvent, query } from '$app/server';
import { fail } from '@sveltejs/kit';
import z from 'zod';

export const getStatus = query(async () => {
	const { locals } = getRequestEvent();
	return await locals.statusService.getWithMessage();
});

const ContanctSubmissionSchema = z.object({
	// Honeypot fields
	name: z.string().optional(),
	email: z.string().optional(),

	// Actual fields
	namekjkj: z.string().min(1, 'Name is required'),
	emailkjkj: z.email('Invalid email address'),
	messagekjkj: z.string().min(1, 'Message is required')
});

export const createContactSubmissionAction = form(
	ContanctSubmissionSchema,
	async ({ name, email, namekjkj, emailkjkj, messagekjkj }) => {
		const { locals, getClientAddress } = getRequestEvent();

		const ip = getClientAddress();

		if (name || email) {
			await locals.banService.banIp(ip);

			return fail(400, { success: false });
		}

		const data = {
			name: namekjkj,
			email: emailkjkj,
			message: messagekjkj
		};

		await locals.contactSubmissionService.create({
			...data,
			ipAddress: ip
		});

		try {
			await locals.emailService.sendContactUsEmail(data);

			return { success: true };
		} catch (error) {
			console.error('Failed to send email:', error);
			return fail(500, { success: false, error: 'Failed to send email' });
		}
	}
);
