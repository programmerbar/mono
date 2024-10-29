
// src/routes/portal/admin/+page.server.ts

import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserService } from '$lib/services/user.service';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user.role !== 'board') {
    throw redirect(307, '/portal');
  }

  const users = await locals.userService.findAll();

  return {
    users
  };
};

export const actions: Actions = {
  updateRole: async ({ request, locals }) => {
    if (locals.user.role !== 'board') {
      return fail(403, { message: 'Access denied' });
    }

    const formData = await request.formData();
    const userId = formData.get('userId');
    const newRole = formData.get('role');

    if (typeof userId !== 'string' || typeof newRole !== 'string') {
      return fail(400, { message: 'Invalid input data' });
    }

    console.log("Updating role for userId:", userId, "to newRole:", newRole);

    const userService = new UserService(locals.db);
    try {
      await userService.updateUserRole(userId, newRole as 'board' | 'normal');
    } catch (error) {
      return fail(500, { message: 'Failed to update role' });
    }

    return { success: true };
  }
};

