import type { Database } from '$lib/db/drizzle';
import { events, shifts, userShifts } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

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

	async createShifts(values: Array<{ eventId: string; start: Date; end: Date }>) {
		if (values.length === 0) {
			return;
		}

		return await this.#db.insert(shifts).values(values).returning();
	}

	async createUserShifts(values: Array<{ shiftId: string; userId: string }>) {
		if (values.length === 0) {
			return;
		}

		return await this.#db.insert(userShifts).values(values);
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

	async delete(id: string) {
		await this.#db.delete(events).where(eq(events.id, id));
	}
}
