import type { Database } from '$lib/db/drizzle';
import { events, shifts, userShifts } from '$lib/db/schema';
import { eq, and, lte, gte } from 'drizzle-orm';

export class ShiftService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async findCompletedShiftsByUserId(userId: string) {
		const completedShifts = await this.#db
			.select()
			.from(shifts)
			.leftJoin(userShifts, eq(shifts.id, userShifts.shiftId))
			.where(
				and(
					eq(userShifts.userId, userId),
					eq(userShifts.status, 'accepted'),
					lte(shifts.end, new Date())
				)
			);

		return completedShifts.map((shifts) => shifts.shift);
	}

	async findUpcomingShiftsByUserId(userId: string) {
		const upcomingShifts = this.#db
			.select()
			.from(shifts)
			.leftJoin(userShifts, eq(shifts.id, userShifts.shiftId))
			.leftJoin(events, eq(shifts.eventId, events.id))
			.where(
				and(
					eq(userShifts.userId, userId),
					// eq(userShifts.status, 'accepted'), // Uncomment this line when we can accept shifts
					gte(shifts.start, new Date())
				)
			);

		return upcomingShifts;
	}
}
