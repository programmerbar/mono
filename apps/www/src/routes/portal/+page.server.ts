import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, '/login');
	}

	const [userShifts, unclaimedBeers, upcomingShifts, canUserRefer, users] = await Promise.all([
		locals.shiftService.findCompletedShiftsByUserId(locals.user.id),
		locals.beerService.getTotalAvailableBeers(locals.user.id),
		locals.shiftService.findUpcomingShiftsByUserId(locals.user.id),
    locals.referralService.canUserRefer(locals.user.id),
    locals.userService.findAll().then((users) => 
      users.map((user) => ({
        label: user.name,
        value: user.id
      }))
    )
	]);

  checkAndCompleteReferrals(locals).catch(console.error);

  const result = {
    shiftsCompleted: userShifts.length,
    unclaimedBeers: unclaimedBeers,
    upcomingShifts,
    canRefer: canUserRefer,
    users
  };

console.log('Load function returning:', result);
return result;
	return {
		shiftsCompleted: userShifts.length,
		unclaimedBeers: unclaimedBeers,
		upcomingShifts,
    canRefer: canUserRefer,
    users
	};
};

async function checkAndCompleteReferrals(locals: any) {
	try {
		const allUsers = await locals.userService.findAll();
		
		for (const user of allUsers) {
			const completedShifts = await locals.shiftService.findCompletedShiftsByUserId(user.id);
			
			if (completedShifts.length === 1) { 
				const referral = await locals.referralService.completeReferral(user.id);
				if (referral) {
					await locals.referralService.awardReferralCredit(referral.referredBy);
				}
			}
		}
	} catch (error) {
		console.error('Referral check failed:', error);
	}
}

export const actions: Actions = {
	refer: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(307, '/login');
		}

		const formData = await request.formData();
		const referrerId = formData.get('referrerId')?.toString();

		if (!referrerId) {
			return fail(400, { error: 'No person found' });
		}

		const canRefer = await locals.referralService.canUserRefer(locals.user.id);
		if (!canRefer) {
			return fail(400, { error: 'Cannot refer' });
		}


		const existingReferral = await locals.referralService.findPendingReferralForUser(locals.user.id);
		if (existingReferral) {
			return fail(400, { error: 'Du har allerede registrert en henvisning' });
		}

		try {
			await locals.referralService.createReferral(referrerId, locals.user.id);
			return { success: true };
		} catch (error) {
			console.error('Referral creation failed:', error);
			return fail(500, { error: 'Noe gikk galt ved opprettelse av henvisning' });
		}
	}
};
