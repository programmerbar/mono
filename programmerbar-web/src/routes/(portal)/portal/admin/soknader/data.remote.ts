import { form, getRequestEvent } from '$app/server';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import z from 'zod';

const ApproveActionBody = z.object({
	applicationId: z.string(),
	name: z.string().min(1),
	email: z.email(),
	feideId: z.string().min(1)
});

export const approveAction = form(ApproveActionBody, async (data) => {
	const { locals } = getRequestEvent();

	if (!locals.user || locals.user.role !== 'board') {
		return fail(401, { error: 'Unauthorized' });
	}

	const userId = nanoid();
	await locals.userService.create({
		id: userId,
		...data
	});

	await locals.pendingApplicationService.delete(data.applicationId);

	return { success: true, message: 'Application approved and user created' };
});

const DenyActionBody = z.object({
	applicationId: z.string(),
	email: z.email(),
	feideId: z.string().min(1)
});

export const deny = form(DenyActionBody, async (data) => {
	const { locals } = getRequestEvent();

	if (!locals.user || locals.user.role !== 'board') {
		return fail(401, { error: 'Unauthorized' });
	}

	await locals.pendingApplicationService.delete(data.applicationId);

	const existingUser = await locals.userService.findByFeideId(data.feideId);
	if (existingUser) {
		await locals.userService.deleteUser(existingUser.id);
	}

	const existingInvitation = await locals.invitationService.findByEmail(data.email);
	if (existingInvitation) {
		await locals.invitationService.delete(existingInvitation.id);
	}

	return { success: true, message: 'Application denied and data removed' };
});
