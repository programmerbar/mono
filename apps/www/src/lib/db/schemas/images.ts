import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

export const images = sqliteTable('images', {
	id: text().primaryKey(),
	filename: text().notNull(),
	size: integer().notNull(), // In bytes
	type: text().notNull(),
	createdAt: integer({ mode: 'timestamp' }).notNull(),
	updatedAt: integer({ mode: 'timestamp' }).notNull()
});

export type Image = InferSelectModel<typeof images>;
export type ImageInsert = InferInsertModel<typeof images>;
