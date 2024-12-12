import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { shifts } from './shifts';

export const events = sqliteTable('event', {
	id: text().notNull().primaryKey().$defaultFn(nanoid),
	name: text().notNull(),
	date: integer({ mode: 'timestamp' }).notNull()
});

export const eventsRelations = relations(events, ({ many }) => ({
	shifts: many(shifts)
}));

export type Event = InferSelectModel<typeof events>;
export type EventInsert = InferInsertModel<typeof events>;
