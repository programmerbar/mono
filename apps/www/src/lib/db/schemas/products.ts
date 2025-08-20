import { text, integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';
import { producers } from './producers';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { productTypes } from './product-types';

export const products = sqliteTable('products', {
	id: text().primaryKey(),
	sku: text(), // Frontline ID
	name: text().notNull(),
	description: text(),
	isSoldOut: integer({ mode: 'boolean' }).notNull().default(false),
	// Price information
	ordinaryPrice: integer().notNull(),
	studentPrice: integer().notNull(),
	internalPrice: integer().notNull(),
	credits: integer(), // 1-5 range
	// Product details
	volume: real(), // in liters
	alcoholContent: real(), // percentage
	variants: text({ mode: 'json' }),
	imageId: text(),
	// Relations
	producerId: text().references(() => producers.id),
	createdAt: text().notNull(),
	updatedAt: text().notNull()
});

export const productsRelations = relations(products, ({ one, many }) => ({
	producer: one(producers, {
		fields: [products.producerId],
		references: [producers.id]
	}),
	types: many(productTypes)
}));

export type Product = InferSelectModel<typeof products>;
export type ProductInsert = InferInsertModel<typeof products>;
export type ProductUpdate = Partial<ProductInsert>;
