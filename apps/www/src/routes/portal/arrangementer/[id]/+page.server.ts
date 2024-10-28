import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { events } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const event = await locals.db.query.events.findFirst({
		where: (row, { eq }) => eq(row.id, params.id),
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

	if (!event) {
		throw error(404, 'Event not found');
	}

	return {
		event
	};
};

export const actions: Actions = {
	delete: async ({ params, locals }) => {
		await locals.db.delete(events).where(eq(events.id, params.id));
		throw redirect(303, '/portal/arrangementer');
	}
};
