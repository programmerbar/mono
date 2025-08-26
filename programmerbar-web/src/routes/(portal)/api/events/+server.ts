import { CreateEventSchema } from '$lib/validators';
import type { RequestHandler } from './$types';
import type { ShiftEmailProps } from '$lib/services/email.service';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check if the user is authenticated
	if (!locals.user) {
		return Response.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Get the JSON body
	const json = await request.json().catch(() => null);
	if (!json) {
		return Response.json({ message: 'Invalid JSON' }, { status: 400 });
	}

	// Parse the json body to the correct schema
	const { name, date, shifts } = CreateEventSchema.parse(json);
	const event = await locals.eventService.create(name, date);

	if (!event) {
		return Response.json({ message: 'Failed to create event' }, { status: 500 });
	}

	// Create shifts
	const mappedShifts = shifts.map((shift) => ({
		eventId: event.id,
		startAt: new Date(shift.startAt),
		endAt: new Date(shift.endAt)
	}));

	const createdShifts = await locals.eventService.createShifts(mappedShifts);

	if (!createdShifts) {
		return Response.json({ message: 'Failed to create shifts' }, { status: 500 });
	}

	// Create user shifts
	const mappedUserShifts = createdShifts.flatMap((shift, i) => {
		return shifts[i].users.map((user) => ({
			shiftId: shift.id,
			userId: user
		}));
	});
	await locals.eventService.createUserShifts(mappedUserShifts);

	// Send notification emails to users
	const userIds = Array.from(new Set(mappedUserShifts.flatMap((shift) => shift.userId)));
	await sendShiftEmails(locals, userIds, event.name, createdShifts, shifts);

	return Response.json({ eventId: event.id }, { status: 201 });
};

async function sendShiftEmails(
	locals: App.Locals,
	userIds: Array<string>,
	eventName: string,
	createdShifts: Awaited<ReturnType<App.Locals['eventService']['createShifts']>>,
	shifts: z.infer<typeof CreateEventSchema>['shifts']
) {
	const users = await locals.userService.findManyById(userIds);

	const emailsToSend: Array<ShiftEmailProps> = [];

	for (const shift of createdShifts) {
		const shiftData = shifts.find((s) => {
			return (
				new Date(s.startAt).toISOString() === new Date(shift.startAt).toISOString() &&
				new Date(s.endAt).toISOString() === new Date(shift.endAt).toISOString()
			);
		});

		if (!shiftData) {
			console.warn(`No matching shift data found for shift ID ${shift.id}`);
			continue;
		}

		for (const userId of shiftData.users) {
			const user = users.find((u) => u.id === userId);

			if (!user || !user.email) continue;

			emailsToSend.push({
				user: {
					name: user.name || 'Frivillig',
					email: user.altEmail || user.email
				},
				shift: {
					id: shift.id,
					startAt: new Date(shift.startAt).toISOString(),
					endAt: new Date(shift.endAt).toISOString(),
					summary: `Vakt: ${eventName}`,
					description: `Du har fått en vakt på "${eventName}".`
				}
			});
		}
	}

	const emailPromises = [];

	for (const data of emailsToSend) {
		emailPromises.push(
			locals.emailService
				.sendShiftEmail(data)
				.then(() =>
					console.log(`Sent shift email to ${data.user.email} for shift ${data.shift.id}`)
				)
				.catch((err: Error) => console.error(`Failed to send email to ${data.user.email}:`, err))
		);
	}

	// Execute all emails in parallel
	if (emailPromises.length > 0) {
		await Promise.allSettled(emailPromises);
		console.log(`Processed ${emailPromises.length} email notifications`);
	}
}
