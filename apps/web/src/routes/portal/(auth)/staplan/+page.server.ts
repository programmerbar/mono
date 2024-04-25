import type { Actions, PageServerLoad } from './$types';
import { getEvents } from '$lib/data/sanity/events';
import { z } from 'zod';
import { isBefore } from 'date-fns';
import { shiftTable, usersToShiftsTable } from '$lib/server/db/schema';
import { createShiftId } from '$lib/id';

export const load: PageServerLoad = async ({ parent, locals, depends }) => {
	depends('shifts');

	const { user } = await parent();

	const shifts = await locals.db.query.shiftTable.findMany({
		with: {
			members: {
				with: {
					user: true
				}
			}
		}
	});

	return {
		user,
		shifts
	};
};
