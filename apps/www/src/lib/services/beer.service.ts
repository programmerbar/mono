import type { Database } from '$lib/db/drizzle';
import { users, userShifts } from '$lib/db/schemas';
import { eq, and } from 'drizzle-orm';
import { ShiftService } from './shift.service';
import { claimedCredits, type ClaimedCreditInsert } from '$lib/db/schemas';
import { nanoid } from 'nanoid';

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

	async claimProductCredits(
		userId: string,
		creditCost: number,
		productDetails?: {
			productId: string;
		}
	): Promise<boolean> {
		try {
			const unclaimedShifts = await this.#shiftService.findShiftsWithUnclaimedBeersByUserId(userId);
			const shiftBeersCount = unclaimedShifts.length;
			console.log('Shift beers info:', { shiftBeersCount });

			const userResult = await this.#db
				.select({ additionalBeers: users.additionalBeers, name: users.name })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			const additionalBeersCount = Number(userResult[0]?.additionalBeers ?? 0);
			const totalAvailable = shiftBeersCount + additionalBeersCount;

			if (totalAvailable < creditCost) {
				return false;
			}

			let remainingCost = creditCost;

			const shiftsToUse = Math.min(shiftBeersCount, remainingCost);

			if (shiftsToUse > 0) {
				for (let i = 0; i < shiftsToUse; i++) {
					const shiftToUpdate = unclaimedShifts[i].shift;

					await this.#db
						.update(userShifts)
						.set({ isBeerClaimed: true })
						.where(and(eq(userShifts.shiftId, shiftToUpdate.id), eq(userShifts.userId, userId)));
				}
				remainingCost -= shiftsToUse;
			}

			if (remainingCost > 0) {
				if (additionalBeersCount < remainingCost) {
					return false;
				}

				await this.#db
					.update(users)
					.set({ additionalBeers: additionalBeersCount - remainingCost })
					.where(eq(users.id, userId));
			}

			if (productDetails) {
				const claimRecord: ClaimedCreditInsert = {
					id: nanoid(),
					userId,
					productId: productDetails.productId,
					creditCost,
					createdAt: new Date()
				};

				await this.#db.insert(claimedCredits).values(claimRecord);
				console.log('Claim logged successfully:', claimRecord);
			}

			console.log('Credits claimed successfully');
			return true;
		} catch (error) {
			console.error('Error claiming product credits:', error);
			return false;
		}
	}
}
