import type { Database } from '$lib/server/db/drizzle';
import { users, userShifts } from '$lib/server/db/schemas';
import { eq, and } from 'drizzle-orm';
import { ShiftService } from './shift.service';
import { claimedCredits, type ClaimedCreditInsert } from '$lib/server/db/schemas';
import { nanoid } from 'nanoid';

export class BeerService {
	#db: Database;
	#shiftService: ShiftService;

	constructor(db: Database, shiftService: ShiftService) {
		this.#db = db;
		this.#shiftService = shiftService;
	}

	async claimBeer(userId: string): Promise<boolean> {
		console.log(`[BeerService] Attempting to claim beer for user: ${userId}`);
		try {
			const unclaimedShifts = await this.#shiftService.findShiftsWithUnclaimedBeersByUserId(userId);

			if (unclaimedShifts.length > 0) {
				const shiftToUpdate = unclaimedShifts[0].shift;

				if (shiftToUpdate) {
					console.log(`[BeerService] Claiming beer from shift: ${shiftToUpdate.id}`);
					await this.#db
						.update(userShifts)
						.set({ isBeerClaimed: true })
						.where(and(eq(userShifts.shiftId, shiftToUpdate.id), eq(userShifts.userId, userId)));
					console.log(`[BeerService] ✅ Beer claimed from shift for user ${userId}`);
					return true;
				}
			}

			console.log(`[BeerService] No unclaimed shift beers, checking additional beers`);
			const user = await this.#db
				.select({ additionalBeers: users.additionalBeers })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			if (user.length > 0 && user[0].additionalBeers > 0) {
				console.log(
					`[BeerService] Claiming from additional beers (${user[0].additionalBeers} available)`
				);
				await this.#db
					.update(users)
					.set({ additionalBeers: user[0].additionalBeers - 1 })
					.where(eq(users.id, userId));
				console.log(`[BeerService] ✅ Beer claimed from additional beers for user ${userId}`);
				return true;
			}

			console.log(`[BeerService] ❌ No beers available to claim for user ${userId}`);
			return false;
		} catch (error) {
			console.error(`[BeerService] ❌ Error claiming beer for user ${userId}:`, error);
			return false;
		}
	}

	async getTotalAvailableBeers(userId: string): Promise<number> {
		console.log(`[BeerService] Getting total available beers for user: ${userId}`);
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

			console.log(
				`[BeerService] Total beers for ${userId}: ${totalBeers} (${unclaimedShiftBeers} from shifts + ${additionalBeers} additional)`
			);
			return totalBeers;
		} catch (error) {
			console.error(
				`[BeerService] ❌ Error getting total available beers for user ${userId}:`,
				error
			);
			return 0;
		}
	}

	async updateBeers(userId: string, newBeerCount: number): Promise<boolean> {
		console.log(`[BeerService] Updating beers for user ${userId} to: ${newBeerCount}`);
		if (!Number.isInteger(newBeerCount) || newBeerCount < 0) {
			console.error(`[BeerService] ❌ Invalid additional beer count: ${newBeerCount}`);
			return false;
		}

		const unclaimedShifts = await this.#shiftService.findShiftsWithUnclaimedBeersByUserId(userId);
		const unclaimedShiftBeers = unclaimedShifts.length;

		const reqBeers = Math.max(newBeerCount - unclaimedShiftBeers, 0);

		console.log(
			`[BeerService] Setting additional beers to ${reqBeers} (${newBeerCount} target - ${unclaimedShiftBeers} from shifts)`
		);
		await this.#db.update(users).set({ additionalBeers: reqBeers }).where(eq(users.id, userId));

		console.log(`[BeerService] ✅ Beer count updated for user ${userId}`);
		return true;
	}

	async claimProductCredits(
		userId: string,
		creditCost: number,
		productDetails?: {
			productId: string;
		}
	): Promise<boolean> {
		console.log(`[BeerService] Claiming ${creditCost} credit(s) for user ${userId}`);
		try {
			const unclaimedShifts = await this.#shiftService.findShiftsWithUnclaimedBeersByUserId(userId);
			const shiftBeersCount = unclaimedShifts.length;
			console.log(`[BeerService] Shift beers available: ${shiftBeersCount}`);

			const userResult = await this.#db
				.select({ additionalBeers: users.additionalBeers, name: users.name })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			const additionalBeersCount = Number(userResult[0]?.additionalBeers ?? 0);
			const totalAvailable = shiftBeersCount + additionalBeersCount;

			console.log(
				`[BeerService] Total credits available: ${totalAvailable} (${shiftBeersCount} shifts + ${additionalBeersCount} additional)`
			);

			if (totalAvailable < creditCost) {
				console.log(
					`[BeerService] ❌ Insufficient credits: need ${creditCost}, have ${totalAvailable}`
				);
				return false;
			}

			let remainingCost = creditCost;

			const shiftsToUse = Math.min(shiftBeersCount, remainingCost);

			if (shiftsToUse > 0) {
				console.log(`[BeerService] Claiming ${shiftsToUse} credit(s) from shifts`);
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
					console.log(
						`[BeerService] ❌ Insufficient additional beers: need ${remainingCost}, have ${additionalBeersCount}`
					);
					return false;
				}

				console.log(`[BeerService] Claiming ${remainingCost} credit(s) from additional beers`);
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
				console.log(
					`[BeerService] Claim record logged: ${claimRecord.id} for product ${productDetails.productId}`
				);
			}

			console.log(`[BeerService] ✅ Credits claimed successfully for user ${userId}`);
			return true;
		} catch (error) {
			console.error(`[BeerService] ❌ Error claiming product credits for user ${userId}:`, error);
			return false;
		}
	}
}
