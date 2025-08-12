import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const userId = params.id;

	if (!locals.user || locals.user.role !== 'board') {
		throw error(401, 'Unauthorized');
	}

	if (!userId) {
		throw error(404, 'User ID not provided');
	}

	const user = await locals.userService.findById(userId);
	if (!user) {
		throw error(404, 'User not found');
	}

	const userShifts = await locals.shiftService.findCompletedShiftsByUserId(userId);
	const unclaimedBeers = await locals.beerService.getTotalAvailableBeers(userId);
	const referrals = await locals.referralService.getReferralStats(userId);
	const shifts = await locals.shiftService.findUpcomingShiftsByUserId(userId);

	return {
		user,
		timesVolunteered: userShifts.length,
		unclaimedBeers,
		referrals,
		shifts
	};
};

export const actions: Actions = {
	updateUser: async ({ params, request, locals }) => {
		const userId = params.id;
		const formData = await request.formData();
		const role = formData.get('role')?.toString() as 'board' | 'normal';
		const phone = formData.get('phone')?.toString();
		if (phone) {
			await locals.userService.updatePhone(userId, phone);
		}
		if (role) {
			await locals.userService.updateUserRole(userId, role);
		}
		return { success: true };
	},

	addBeers: async ({ params, request, locals }) => {
		const userId = params.id;
		if (!locals.user || locals.user.role !== 'board') {
			return fail(401, {
				success: false,
				message: 'Unauthorized'
			});
		}
		const formData = await request.formData();
		const additionalBeers = +Number(formData.get('additionalBeers'));
		const success = await locals.beerService.updateBeers(userId, additionalBeers);
		if (!success) {
			return fail(400, {
				success: false,
				message: 'Failed to update beers'
			});
		}
		return { success: true };
	},

	deleteUser: async ({ params, request, locals }) => {
		const userId = params.id;

		if (!locals.user || locals.user.role !== 'board') {
			return fail(401, {
				success: false,
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const confirmDelete = formData.get('confirmDelete')?.toString();

		const user = await locals.userService.findById(userId);
		if (confirmDelete !== user?.name) {
			return fail(400, {
				success: false,
				message: "Names doesn't match"
			});
		}
		const success = await locals.userService.deleteUser(userId);

		const invId = await locals.invitationService.findByEmail(user.email);

		if (invId) {
			await locals.invitationService.delete(invId.id);
		}

		if (!success) {
			return fail(400, {
				success: false,
				message: 'Failed to delete user'
			});
		}

		return { success: true, message: `${user.name} er no slettet!` };
	}
};
