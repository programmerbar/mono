import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const productTypes = sqliteTable('product_types', {
	id: text().primaryKey(),
	title: text().notNull(),
	createdAt: text().notNull(),
	updatedAt: text().notNull()
});

export type ProductType = InferSelectModel<typeof productTypes>;
export type ProductTypeInsert = InferInsertModel<typeof productTypes>;
