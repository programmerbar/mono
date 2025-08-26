import type { Database } from '$lib/db/drizzle';
import {
	events,
	shifts,
	userShifts,
	type ShiftInsert,
	type UserShiftInsert
} from '$lib/db/schemas';
import { and, eq } from 'drizzle-orm';

export class EventService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async create(name: string, date: Date) {
		const event = await this.#db
			.insert(events)
			.values({
				name: name,
				date: date
			})
			.returning()
			.then((rows) => rows[0]);

		return event;
	}

	async createShifts(values: Array<ShiftInsert>) {
		if (values.length === 0) {
			return [];
		}

		return await this.#db.insert(shifts).values(values).returning();
	}

	async createUserShifts(values: Array<UserShiftInsert>) {
		if (values.length === 0) {
			return;
		}

		return await this.#db.insert(userShifts).values(values);
	}

	async createUserShift(values: UserShiftInsert) {
		return await this.createUserShifts([values]);
	}

	async deleteUserShift(values: { shiftId: string; userId: string }) {
		await this.#db
			.delete(userShifts)
			.where(and(eq(userShifts.shiftId, values.shiftId), eq(userShifts.userId, values.userId)));
	}

	async findFullEventById(id: string) {
		const event = await this.#db.query.events.findFirst({
			where: (row, { eq }) => eq(row.id, id),
			with: {
				shifts: {
					with: {
						members: {
							with: {
								user: true
							}
						}
					}
				}
			}
		});

		return event;
	}

	async updateEvent(id: string, eventData: { name: string; date: Date }) {
		const event = await this.#db
			.insert(events)
			.values({
				id,
				...eventData
			})
			.onConflictDoUpdate({
				target: events.id,
				set: eventData
			})
			.returning()
			.then((rows) => rows[0]);

		return event;
	}

	async updateShift(id: string, shiftData: { eventId: string; startAt: Date; endAt: Date }) {
		const shift = await this.#db
			.insert(shifts)
			.values({
				id,
				...shiftData
			})
			.onConflictDoUpdate({
				target: shifts.id,
				set: shiftData
			})
			.returning()
			.then((rows) => rows[0]);
		return shift;
	}

	async findUpcomingEvents() {
		const event = await this.#db.query.events.findMany({
			orderBy: (row, { asc }) => [asc(row.date)],
			with: {
				shifts: {
					with: {
						members: {
							with: {
								user: true
							}
						}
					}
				}
			},
			where: (events, { gte }) => gte(events.date, new Date())
		});

		return event;
	}

	async findPastEvents() {
		const event = await this.#db.query.events.findMany({
			orderBy: (row, { desc }) => [desc(row.date)],
			with: {
				shifts: {
					with: {
						members: {
							with: {
								user: true
							}
						}
					}
				}
			},
			where: (events, { lt }) => lt(events.date, new Date())
		});

		return event;
	}

	async delete(id: string) {
		await this.#db.delete(events).where(eq(events.id, id));
	}

	async deleteShift(id: string) {
		await this.#db.delete(userShifts).where(eq(userShifts.shiftId, id));
		await this.#db.delete(shifts).where(eq(shifts.id, id));
	}
}
