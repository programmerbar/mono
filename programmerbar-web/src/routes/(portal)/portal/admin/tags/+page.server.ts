import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

async function checkTagPermissions(locals: App.Locals) {
	if (!locals.user || locals.user.role !== 'board') {
		return { authorized: false, canManage: false };
	}

	const canManage = await locals.tagService.canManageTags(locals.user.id);
	return { authorized: true, canManage };
}

function extractPermissionOptions(formData: FormData, canManageOptions: boolean) {
	return canManageOptions
		? Object.fromEntries(
				Array.from(formData.entries())
					.filter(([key, value]) => key.startsWith('can') && value !== null)
					.map(([key, value]) => [key, value === 'on'])
			)
		: undefined;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'board') {
		throw redirect(307, '/portal');
	}

	const canManage = await locals.tagService.canManageTags(locals.user.id);
	if (!canManage) {
		throw redirect(307, '/portal/admin');
	}

	const canManageOptions = await locals.tagService.canManageTagOptions(locals.user.id);

	const tags = await locals.tagService.getAllTags();

	const allUsers = await locals.userService.findAll();

	const userTagsMap = await locals.tagService.getUserTagsForUsers(allUsers.map((u) => u.id));

	const usersWithTags = allUsers.filter((user) => userTagsMap.has(user.id));

	return {
		tags,
		allUsers,
		users: usersWithTags,
		userTags: Object.fromEntries(userTagsMap),
		canManageOptions
	};
};

export const actions: Actions = {
	createTag: async ({ locals, request }) => {
		const { authorized, canManage } = await checkTagPermissions(locals);
		if (!authorized) return fail(401, { message: 'Unauthorized' });
		if (!canManage) return fail(403, { message: 'Insufficient permissions' });

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const color = formData.get('color') as string;

		if (!name) {
			return fail(400, { message: 'Tag name is required' });
		}

		const canManageOptions = await locals.tagService.canManageTagOptions(locals.user!.id);
		const options = extractPermissionOptions(formData, canManageOptions);

		const success = await locals.tagService.createTag(
			name,
			description || undefined,
			color || undefined,
			options
		);
		if (!success) {
			return fail(400, { message: 'Failed to create tag. Name might already exist.' });
		}
	},

	updateTag: async ({ locals, request }) => {
		const { authorized, canManage } = await checkTagPermissions(locals);
		if (!authorized) return fail(401, { message: 'Unauthorized' });
		if (!canManage) return fail(403, { message: 'Insufficient permissions' });

		const formData = await request.formData();
		const tagId = formData.get('tagId') as string;
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const color = formData.get('color') as string;

		if (!tagId || !name) {
			return fail(400, { message: 'Tag ID and name are required' });
		}

		const canManageOptions = await locals.tagService.canManageTagOptions(locals.user!.id);

		const updates = {
			name,
			description: description || undefined,
			color: color || undefined,
			...extractPermissionOptions(formData, canManageOptions)
		};

		const success = await locals.tagService.updateTag(tagId, updates);
		if (!success) {
			return fail(400, { message: 'Failed to update tag' });
		}
	},

	deleteTag: async ({ locals, request }) => {
		const { authorized, canManage } = await checkTagPermissions(locals);
		if (!authorized) return fail(401, { message: 'Unauthorized' });
		if (!canManage) return fail(403, { message: 'Insufficient permissions' });

		const formData = await request.formData();
		const tagId = formData.get('tagId') as string;

		if (!tagId) {
			return fail(400, { message: 'Tag ID is required' });
		}

		const success = await locals.tagService.deleteTag(tagId);
		if (!success) {
			return fail(400, { message: 'Failed to delete tag' });
		}
	},

	assignTag: async ({ locals, request }) => {
		const { authorized, canManage } = await checkTagPermissions(locals);
		if (!authorized) return fail(401, { message: 'Unauthorized' });
		if (!canManage) return fail(403, { message: 'Insufficient permissions' });

		const formData = await request.formData();
		const tagId = formData.get('tagId') as string;
		const userId = formData.get('userId') as string;

		if (!tagId || !userId) {
			return fail(400, { message: 'Tag ID and User ID are required' });
		}

		const success = await locals.tagService.assignTagToUser(tagId, userId, locals.user!.id);
		if (!success) {
			return fail(400, { message: 'Failed to assign tag' });
		}

		// Send notification about tag assignment
		const tag = await locals.tagService.getTagById(tagId);
		if (tag) {
			await locals.notificationService.notifyTagAssigned(tag.name, userId, locals.user!.id);
		}

		return { success: true, message: 'Tag assigned successfully' };
	},

	removeTag: async ({ locals, request }) => {
		const { authorized, canManage } = await checkTagPermissions(locals);
		if (!authorized) return fail(401, { message: 'Unauthorized' });
		if (!canManage) return fail(403, { message: 'Insufficient permissions' });

		const formData = await request.formData();
		const tagId = formData.get('tagId') as string;
		const userId = formData.get('userId') as string;

		if (!tagId || !userId) {
			return fail(400, { message: 'Tag ID and User ID are required' });
		}

		// Get tag info before removing for notification
		const tag = await locals.tagService.getTagById(tagId);

		const success = await locals.tagService.removeTagFromUser(tagId, userId);
		if (!success) {
			return fail(400, { message: 'Failed to remove tag' });
		}

		// Send notification about tag removal
		if (tag) {
			await locals.notificationService.notifyTagRemoved(tag.name, userId, locals.user!.id);
		}

		return { success: true, message: 'Tag removed successfully' };
	}
};
