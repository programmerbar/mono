import { CreateEventSchema } from '$lib/validators';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response(null, { status: 401 });
	}

	const { name, date, shifts: jshifts } = await request.json().then(CreateEventSchema.parse);

	const event = await locals.eventService.create(name, date);

	if (!event) {
		return new Response(null, { status: 500 });
	}

	const shiftsToInsert = jshifts.map((shift) => ({
		eventId: event.id,
		start: shift.start,
		end: shift.end
	}));

	const createdShifts = await locals.eventService.createShifts(shiftsToInsert);

	const userShiftsToInsert = createdShifts?.flatMap((shift, shiftIndex) => {
		return jshifts[shiftIndex].users.map((user) => ({
			shiftId: shift.id,
			userId: user
		}));
	});

	await locals.eventService.createUserShifts(userShiftsToInsert ?? []);

	return new Response(null, { status: 201 });
};
