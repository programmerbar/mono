import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { nanoid } from 'nanoid';
import { booking } from './booking'; 
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const invoice = sqliteTable('invoice', {
	id: text('id').primaryKey().$defaultFn(nanoid),
	eventId: text()
		.notNull()
		.references(() => booking.id, {
			onDelete: 'cascade'
		}),

});

export const invoiceRelations = relations(invoice, ({ one }) => ({
	booking: one(booking, {
		fields: [invoice.eventId],
		references: [booking.id]
	})
}));

export type Invoice = InferSelectModel<typeof invoice>;
export type InvoiceInsert = InferInsertModel<typeof invoice>;
