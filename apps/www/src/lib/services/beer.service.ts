import type { Database } from '$lib/db/drizzle';
import { users, userShifts } from '$lib/db/schemas';
import { eq, and } from 'drizzle-orm';
import { ShiftService } from './shift.service';

export class BeerService {
	#db: Database;
	#shiftService: ShiftService;

	constructor(db: Database, shiftService: ShiftService) {
		this.#db = db;
		this.#shiftService = shiftService;
	}

	async claimBeer(userId: string): Promise<boolean> {
		try {
			const unclaimedShifts = await this.#shiftService.findShiftsWithUnclaimedBeersByUserId(userId);

			if (unclaimedShifts.length > 0) {
				const shiftToUpdate = unclaimedShifts[0].shift;

				if (shiftToUpdate) {
					await this.#db
						.update(userShifts)
						.set({ isBeerClaimed: true })
						.where(and(eq(userShifts.shiftId, shiftToUpdate.id), eq(userShifts.userId, userId)));
					return true;
				}
			}

			const user = await this.#db
				.select({ additionalBeers: users.additionalBeers })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			if (user.length > 0 && user[0].additionalBeers > 0) {
				await this.#db
					.update(users)
					.set({ additionalBeers: user[0].additionalBeers - 1 })
					.where(eq(users.id, userId));
				return true;
			}

			return false;
		} catch (error) {
			console.error('Error claiming beer:', error);
			return false;
		}
	}

	async getTotalAvailableBeers(userId: string): Promise<number> {
		try {
			const unclaimedShifts = await this.#shiftService.findShiftsWithUnclaimedBeersByUserId(userId);
			const unclaimedShiftBeers = unclaimedShifts.length;

			const userResult = await this.#db
				.select({ additionalBeers: users.additionalBeers })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			const additionalBeers = Number(userResult[0]?.additionalBeers ?? 0);
			const totalBeers = unclaimedShiftBeers + additionalBeers;

			return totalBeers;
		} catch (error) {
			console.error('Error getting total available beers:', error);
			return 0;
		}
	}

	// Gives back the difference between newBeercount and shiftBeer, so that we can type in an amount we want and not have the shift beer added afterwards
	async updateBeers(userId: string, newBeerCount: number): Promise<boolean> {
		if (!Number.isInteger(newBeerCount) || newBeerCount < 0) {
			console.error('Invalid additional beer count:', newBeerCount);
			return false;
		}

		const unclaimedShifts = await this.#shiftService.findShiftsWithUnclaimedBeersByUserId(userId);
		const unclaimedShiftBeers = unclaimedShifts.length;

		const reqBeers = Math.max(newBeerCount - unclaimedShiftBeers, 0);

		await this.#db.update(users).set({ additionalBeers: reqBeers }).where(eq(users.id, userId));

		return true;
	}

	async claimProductCredits(userId: string, creditCost: number): Promise<boolean> {
		try {
			console.log('Starting claimProductCredits with', { userId, creditCost });

			const unclaimedShifts = await this.#shiftService.findShiftsWithUnclaimedBeersByUserId(userId);
			const shiftBeersCount = unclaimedShifts.length;
			console.log('Shift beers info:', { shiftBeersCount });

			const userResult = await this.#db
				.select({ additionalBeers: users.additionalBeers })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			const additionalBeersCount = Number(userResult[0]?.additionalBeers ?? 0);
			const totalAvailable = shiftBeersCount + additionalBeersCount;

			console.log('Credit calculation:', {
				additionalBeersCount,
				totalAvailable,
				creditCost,
				hasEnoughCredits: totalAvailable >= creditCost
			});

			if (totalAvailable < creditCost) {
				console.log('Not enough credits available');
				return false;
			}

			let remainingCost = creditCost;

			const shiftsToUse = Math.min(shiftBeersCount, remainingCost);
			console.log('Shifts to use:', shiftsToUse);

			if (shiftsToUse > 0) {
				console.log('Using shifts for credits');
				for (let i = 0; i < shiftsToUse; i++) {
					const shiftToUpdate = unclaimedShifts[i].shift;
					console.log('Updating shift:', shiftToUpdate.id);

					await this.#db
						.update(userShifts)
						.set({ isBeerClaimed: true })
						.where(and(eq(userShifts.shiftId, shiftToUpdate.id), eq(userShifts.userId, userId)));
				}
				remainingCost -= shiftsToUse;
				console.log('Remaining cost after using shifts:', remainingCost);
			}

			if (remainingCost > 0) {
				console.log('Using additional beers for remaining cost', remainingCost);
				if (additionalBeersCount < remainingCost) {
					console.log('Not enough additional beers');
					return false;
				}

				console.log('Updating user additional beers', {
					from: additionalBeersCount,
					to: additionalBeersCount - remainingCost
				});

				await this.#db
					.update(users)
					.set({ additionalBeers: additionalBeersCount - remainingCost })
					.where(eq(users.id, userId));
			}

			console.log('Credits claimed successfully');
			return true;
		} catch (error) {
			console.error('Error claiming product credits:', error);
			return false;
		}
	}
}
