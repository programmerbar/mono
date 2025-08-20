import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { products } from './products';

export const producers = sqliteTable('producers', {
	id: text().notNull().primaryKey(),
	name: text().notNull(),
	imageId: text(),
	createdAt: text().notNull(),
	updatedAt: text().notNull()
});

export const producersRelations = relations(producers, ({ many }) => ({
	products: many(products)
}));

export type Producer = InferSelectModel<typeof producers>;
export type ProducerInsert = InferInsertModel<typeof producers>;
