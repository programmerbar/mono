import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { shifts } from './shifts';

export const events = sqliteTable(
	'event',
	{
		id: text().notNull().primaryKey().$defaultFn(nanoid),
		name: text().notNull(),
		description: text(),
		slug: text(),
		date: integer({ mode: 'timestamp' }).notNull()
	},
	(t) => [uniqueIndex('event_slug_idx').on(t.slug)]
);

export const eventsRelations = relations(events, ({ many }) => ({
	shifts: many(shifts)
}));

export type Event = InferSelectModel<typeof events>;
export type EventInsert = InferInsertModel<typeof events>;
