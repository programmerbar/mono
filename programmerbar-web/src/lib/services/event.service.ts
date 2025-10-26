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

	async create(name: string, date: Date, slug: string | null, description: string | null) {
		console.log(`[EventService] Creating event: ${name} on ${date.toISOString()}`);
		const event = await this.#db
			.insert(events)
			.values({
				name: name,
				date: date,
				slug: slug,
				description: description
			})
			.returning()
			.then((rows) => rows[0]);

		console.log(`[EventService] ✅ Event created: ${event.id} (${event.name})`);
		return event;
	}

	async createShifts(values: Array<ShiftInsert>) {
		if (values.length === 0) {
			console.log(`[EventService] No shifts to create`);
			return [];
		}

		console.log(`[EventService] Creating ${values.length} shift(s)`);
		const createdShifts = await this.#db.insert(shifts).values(values).returning();
		console.log(`[EventService] ✅ Created ${createdShifts.length} shift(s)`);
		return createdShifts;
	}

	async createUserShifts(values: Array<UserShiftInsert>) {
		if (values.length === 0) {
			console.log(`[EventService] No user shifts to create`);
			return;
		}

		console.log(`[EventService] Assigning ${values.length} user(s) to shifts`);
		const result = await this.#db.insert(userShifts).values(values);
		console.log(`[EventService] ✅ Assigned ${values.length} user(s) to shifts`);
		return result;
	}

	async createUserShift(values: UserShiftInsert) {
		return await this.createUserShifts([values]);
	}

	async deleteUserShift(values: { shiftId: string; userId: string }) {
		console.log(`[EventService] Removing user ${values.userId} from shift ${values.shiftId}`);
		await this.#db
			.delete(userShifts)
			.where(and(eq(userShifts.shiftId, values.shiftId), eq(userShifts.userId, values.userId)));
		console.log(`[EventService] ✅ User removed from shift`);
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

	async updateEvent(
		id: string,
		eventData: { name: string; date: Date; description: string | null; slug: string | null }
	) {
		console.log(`[EventService] Updating event ${id}: ${eventData.name}`);
		const event = await this.#db
			.insert(events)
			.values({
				id,
				...eventData
			})
			.onConflictDoUpdate({
				target: events.id,
				set: {
					name: eventData.name,
					date: eventData.date,
					description: eventData.description ?? null,
					slug: eventData.slug ?? null
				}
			})
			.returning()
			.then((rows) => rows[0]);

		console.log(`[EventService] ✅ Event updated: ${event.id}`);
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
		console.log(`[EventService] Deleting event: ${id}`);
		await this.#db.delete(events).where(eq(events.id, id));
		console.log(`[EventService] ✅ Event deleted: ${id}`);
	}

	async deleteShift(id: string) {
		console.log(`[EventService] Deleting shift: ${id}`);
		await this.#db.delete(userShifts).where(eq(userShifts.shiftId, id));
		await this.#db.delete(shifts).where(eq(shifts.id, id));
		console.log(`[EventService] ✅ Shift deleted: ${id}`);
	}

	async getUpcomingPublicEvents() {
		return await this.#db.query.events
			.findMany({
				where: (row, { gte, and, isNotNull }) => and(gte(row.date, new Date()), isNotNull(row.slug))
			})
			.then((events) =>
				events.map((event) => ({
					_id: event.id,
					title: event.name,
					slug: event.slug!,
					date: event.date.toISOString(),
					_createdAt: null,
					registrationStart: null,
					body: event.description
				}))
			);
	}

	async getPublicEventBySlug(slug: string) {
		const event = await this.#db.query.events.findFirst({
			where: (row, { eq, isNotNull }) => and(eq(row.slug, slug), isNotNull(row.slug))
		});

		if (!event) {
			return null;
		}

		return {
			_id: event.id,
			title: event.name,
			slug: event.slug!,
			date: event.date.toISOString(),
			_createdAt: null,
			registrationStart: null,
			body: event.description
		};
	}

	async allSlugs() {
		return this.#db.query.events
			.findMany({
				where: (row, { isNotNull }) => isNotNull(row.slug),
				columns: {
					slug: true
				}
			})
			.then((events) => events.map((event) => event.slug!));
	}
}
