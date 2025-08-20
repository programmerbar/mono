import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { products } from './products';
import { productTypes } from './product-types';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

export const productProductTypes = sqliteTable('product_product_types', {
	productId: text()
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	productTypeId: text()
		.notNull()
		.references(() => productTypes.id, { onDelete: 'cascade' })
});

export const productProductTypesRelations = relations(productProductTypes, ({ one }) => ({
	product: one(products, {
		fields: [productProductTypes.productId],
		references: [products.id]
	}),
	typeInfo: one(productTypes, {
		fields: [productProductTypes.productTypeId],
		references: [productTypes.id]
	})
}));

export type ProductProductType = InferSelectModel<typeof productProductTypes>;
export type ProductProductTypeInsert = InferInsertModel<typeof productProductTypes>;
