import type { Actions, PageServerLoad } from './$types';
import { getEvents } from '$lib/data/sanity/events';
import { z } from 'zod';
import { isBefore } from 'date-fns';
import { shiftTable, usersToShiftsTable } from '$lib/server/db/schema';
import { createShiftId } from '$lib/id';

export const load: PageServerLoad = async ({ parent, locals, depends }) => {
	depends('shifts');

	const { user } = await parent();

	const [users, shifts, events] = await Promise.all([
		locals.db.query.userTable.findMany(),
		locals.db.query.shiftTable.findMany({
			with: {
				members: {
					with: {
						user: true
					}
				}
			}
		}),
		getEvents()
	]);

	return {
		user,
		users,
		shifts,
		events
	};
};

const createShiftSchema = z
	.object({
		start: z.coerce.date(),
		end: z.coerce.date(),
		event: z.string(),
		users: z.preprocess((users) => {
			try {
				return JSON.parse(users as string).map((user: string) => user.trim());
			} catch {
				return [];
			}
		}, z.array(z.string()).min(1))
	})
	.superRefine(({ end, start }, ctx) => {
		if (isBefore(end, start)) {
			ctx.addIssue({
				code: 'invalid_date',
				message: 'End date must be after start date',
				path: ['end']
			});
		}
	});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const resp = createShiftSchema.safeParse(Object.fromEntries(formData.entries()));

		if (!resp.success) {
			return {
				success: false,
				errors: resp.error.errors
			};
		}

		const shiftId = createShiftId();
		await locals.db.insert(shiftTable).values({
			id: shiftId,
			start: resp.data.start,
			end: resp.data.end,
			eventId: resp.data.event
		});

		await Promise.all(
			resp.data.users.map((userId) =>
				locals.db.insert(usersToShiftsTable).values({
					shiftId,
					userId
				})
			)
		);

		return {
			success: true
		};
	}
};
