import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usersToShiftsTable } from '.';

export const shiftTable = sqliteTable('shift', {
	id: text('id').notNull().primaryKey(),
	start: integer('start', { mode: 'timestamp' }).notNull(),
	end: integer('end', { mode: 'timestamp' }).notNull(),
	eventId: text('event_id').notNull()
});

export const shiftTableRelations = relations(shiftTable, ({ many }) => {
	return {
		members: many(usersToShiftsTable)
	};
});

export type Shift = (typeof shiftTable)['$inferSelect'];
export type ShiftInsert = (typeof shiftTable)['$inferInsert'];
