import type { Database } from '$lib/db/drizzle';
import { users, userShifts } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { ShiftService } from './shift.service';

export class BeerService {
	#db: Database;
	#shiftService: ShiftService;

	constructor(db: Database) {
		this.#db = db;
		this.#shiftService = new ShiftService(db); // Dont know if this is allowed, but it works hahaha
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
	// Checks the gives back the difference between newBeercount and shiftBeer, so that we can type in an amount we want and not have the shift beer added afterwards
	async updateBeers(userId: string, newBeerCount: number): Promise<boolean> {
		if (!Number.isInteger(newBeerCount) || newBeerCount < 0) {
			console.error('Invalid additional beer count:', newBeerCount);
			return false;
		}

		try {
			const unclaimedShifts = await this.#shiftService.findShiftsWithUnclaimedBeersByUserId(userId);
			const unclaimedShiftBeers = unclaimedShifts.length;

			const reqBeers = Math.max(newBeerCount - unclaimedShiftBeers, 0);

			await this.#db.update(users).set({ additionalBeers: reqBeers }).where(eq(users.id, userId));

			return true;
		} catch (error) {
			console.error('Error updating additional beers:', error);
			return false;
		}
	}
}
