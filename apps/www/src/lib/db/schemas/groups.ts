import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const groups = sqliteTable('group', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description')
});

export type Group = InferSelectModel<typeof groups>;
export type GroupInsert = InferInsertModel<typeof groups>;
