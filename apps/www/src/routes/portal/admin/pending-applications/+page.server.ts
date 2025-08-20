import type { PageServerLoad, Actions } from './$types';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
	const pendingApplications = await locals.pendingApplicationService.findAll();

	return {
		pendingApplications
	};
};

export const actions: Actions = {
	approve: async ({ locals, request }) => {
		const data = await request.formData();
		const applicationId = data.get('applicationId') as string;
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const feideId = data.get('feideId') as string;

		const userId = nanoid();
		await locals.userService.create({
			id: userId,
			name,
			email,
			feideId
		});

		await locals.pendingApplicationService.delete(applicationId);

		return { success: true, message: 'Application approved and user created' };
	},

	deny: async ({ locals, request }) => {
		const data = await request.formData();
		const applicationId = data.get('applicationId') as string;
		const email = data.get('email') as string;
		const feideId = data.get('feideId') as string;

		await locals.pendingApplicationService.delete(applicationId);

		const existingUser = await locals.userService.findByFeideId(feideId);
		if (existingUser) {
			await locals.userService.deleteUser(existingUser.id);
		}

		const existingInvitation = await locals.invitationService.findByEmail(email);
		if (existingInvitation) {
			await locals.invitationService.delete(existingInvitation.id);
		}

		return { success: true, message: 'Application denied and data removed' };
	}
};
