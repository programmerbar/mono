import { CreateEventSchema } from '$lib/validators';
import type { RequestHandler } from './$types';
import { events, shifts, userShifts } from '$lib/db/schema';

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

	const createdShifts = await locals.db
		.insert(shifts)
		.values(
			json.shifts.map((shift) => ({
				eventId: event.id,
				start: shift.start,
				end: shift.end
			}))
		)
		.returning();

	await locals.db.insert(userShifts).values(
		json.shifts.flatMap((shift, shiftIndex) => {
			return shift.users.map((user) => ({
				shiftId: createdShifts[shiftIndex].id,
				userId: user
			}));
		})
	);

	return new Response(null, { status: 201 });
};
