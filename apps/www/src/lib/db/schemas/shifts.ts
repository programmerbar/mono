import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { events } from './events';
import { userShifts } from './user-shifts';

export const shifts = sqliteTable('shift', {
	id: text().notNull().primaryKey().$defaultFn(nanoid),
	eventId: text()
		.notNull()
		.references(() => events.id, {
			onDelete: 'cascade'
		}),
	startAt: integer({ mode: 'timestamp' }).notNull(),
	endAt: integer({ mode: 'timestamp' }).notNull()
});

export const shiftsRelations = relations(shifts, ({ one, many }) => ({
	event: one(events, {
		fields: [shifts.eventId],
		references: [events.id]
	}),
	members: many(userShifts)
}));

export type Shift = InferSelectModel<typeof shifts>;
export type ShiftInsert = InferInsertModel<typeof shifts>;
