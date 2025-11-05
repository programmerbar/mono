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

  const [userShifts, unclaimedBeers, referrals, shifts] = await Promise.all([
      locals.shiftService.findCompletedShiftsByUserId(userId),
      locals.beerService.getTotalAvailableBeers(userId),
      locals.referralService.getReferralStats(userId),
      locals.shiftService.findUpcomingShiftsByUserId(userId)
  ]);

	return {
		user,
		timesVolunteered: userShifts.length,
		unclaimedBeers,
		referrals,
		shifts
	};
};

export const actions: Actions = {
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
		if (!locals.user || locals.user.role !== 'board') {
			return fail(401, {
				success: false,
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const confirmDelete = formData.get('confirmDelete')?.toString();
		const formUserId = formData.get('userId')?.toString();

		const userId = formUserId || params.id;

		if (!userId) {
			return fail(400, {
				success: false,
				message: 'User ID is required'
			});
		}

		const user = await locals.userService.findById(userId);
		if (!user) {
			return fail(404, {
				success: false,
				message: 'User not found'
			});
		}

		if (confirmDelete !== user.name) {
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
	},

	completeTraining: async ({ params, request, locals }) => {
		const userId = params.id;
		const formData = await request.formData();
		const trainingDataJson = formData.get('trainingData') as string;

		if (!userId) {
			return fail(400, { error: 'User ID is required' });
		}

		if (!locals.user || locals.user.role !== 'board') {
			return fail(401, { error: 'Unauthorized' });
		}

		if (!trainingDataJson) {
			return fail(400, { error: 'Training data is required' });
		}

		const trainingData = JSON.parse(trainingDataJson);

		const isComplete =
			trainingData && trainingData.every((item: { completed: boolean }) => item.completed === true);

		if (!isComplete) {
			return fail(400, { error: 'All training items must be completed' });
		}

		const updatedUser = await locals.userService.updateTrainingStatus(userId, true);

		if (!updatedUser) {
			return fail(404, { error: 'User not found' });
		}

		return { success: true, trainingCompleted: true };
	}
};
