import type { Database } from '$lib/server/db/drizzle';
import { events, shifts, userShifts } from '$lib/server/db/schemas';
import { eq, and, lte, gte, inArray } from 'drizzle-orm';

export class ShiftService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async findCompletedShiftsByUserId(userId: string) {
		console.log(`[ShiftService] Finding completed shifts for user: ${userId}`);
		const completedShifts = await this.#db
			.select()
			.from(shifts)
			.leftJoin(userShifts, eq(shifts.id, userShifts.shiftId))
			.where(
				and(
					eq(userShifts.userId, userId),
					eq(userShifts.status, 'accepted'),
					lte(shifts.endAt, new Date())
				)
			);

		console.log(
			`[ShiftService] Found ${completedShifts.length} completed shift(s) for user ${userId}`
		);
		return completedShifts.map((shifts) => shifts.shift);
	}

	async findUsersWithCompletedShiftsByUserIds(userIds: string[]) {
		if (userIds.length === 0) {
			console.log(`[ShiftService] No user IDs provided for completed shifts lookup`);
			return [];
		}

		console.log(
			`[ShiftService] Finding users with completed shifts among ${userIds.length} user(s)`
		);
		const usersWithCompletedShifts = await this.#db
			.select({ userId: userShifts.userId })
			.from(shifts)
			.leftJoin(userShifts, eq(shifts.id, userShifts.shiftId))
			.where(
				and(
					inArray(userShifts.userId, userIds),
					eq(userShifts.status, 'accepted'),
					lte(shifts.endAt, new Date())
				)
			)
			.groupBy(userShifts.userId);

		console.log(
			`[ShiftService] Found ${usersWithCompletedShifts.length} user(s) with completed shifts`
		);
		return usersWithCompletedShifts.map((row) => row.userId);
	}

	async findUpcomingShiftsByUserId(userId: string) {
		console.log(`[ShiftService] Finding upcoming shifts for user: ${userId}`);
		const upcomingShifts = await this.#db
			.select()
			.from(shifts)
			.leftJoin(userShifts, eq(shifts.id, userShifts.shiftId))
			.leftJoin(events, eq(shifts.eventId, events.id))
			.where(
				and(
					eq(userShifts.userId, userId),
					// eq(userShifts.status, 'accepted'), // Uncomment this line when we can accept shifts
					gte(shifts.startAt, new Date())
				)
			);

		console.log(
			`[ShiftService] Found ${upcomingShifts.length} upcoming shift(s) for user ${userId}`
		);
		return upcomingShifts;
	}

	async findShiftsWithUnclaimedBeersByUserId(userId: string) {
		console.log(`[ShiftService] Finding shifts with unclaimed beers for user: ${userId}`);
		const shiftsWithUnclaimedBeer = await this.#db
			.select()
			.from(shifts)
			.leftJoin(userShifts, eq(shifts.id, userShifts.shiftId))
			.where(
				and(
					eq(userShifts.userId, userId),
					// eq(userShifts.status, 'accepted'), // Uncomment this line when we can accept shifts
					eq(userShifts.isBeerClaimed, false),
					lte(shifts.endAt, new Date())
				)
			);

		console.log(
			`[ShiftService] Found ${shiftsWithUnclaimedBeer.length} shift(s) with unclaimed beers for user ${userId}`
		);
		return shiftsWithUnclaimedBeer;
	}
}
