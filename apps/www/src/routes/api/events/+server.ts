import { CreateEventSchema } from '$lib/validators';
import type { RequestHandler } from './$types';
import { events, shifts, userShifts, type Shift } from '$lib/db/schema';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response(null, { status: 401 });
	}

	const json = await request.json().then(CreateEventSchema.parse);

	const event = await locals.db
		.insert(events)
		.values({
			name: json.name,
			date: json.date
		})
		.returning()
		.then((rows) => rows[0]);

	if (!event) {
		return new Response(null, { status: 500 });
	}

	let createdShifts: Array<Shift> = [];

	const shiftsToInsert = json.shifts.map((shift) => ({
		eventId: event.id,
		start: shift.start,
		end: shift.end
	}));

	if (shiftsToInsert.length > 0) {
		createdShifts = await locals.db.insert(shifts).values(shiftsToInsert).returning();
	}

	if (createdShifts.length > 0) {
		const userShiftsToInsert = createdShifts.flatMap((shift, shiftIndex) => {
			return json.shifts[shiftIndex].users.map((user) => ({
				shiftId: shift.id,
				userId: user
			}));
		});

		await locals.db.insert(userShifts).values(userShiftsToInsert);
	}

	return new Response(null, { status: 201 });
};
