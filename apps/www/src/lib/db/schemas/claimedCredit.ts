import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const claimedCredits = sqliteTable('claimed_credits', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	userName: text('user_name').notNull(),
	productId: text('product_id').notNull(),
	productName: text('product_name').notNull(),
	productType: text('product_type'),
	creditCost: integer('credit_cost').notNull(),
	claimedAt: integer('claimed_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Add these type exports
export type ClaimedCredit = InferSelectModel<typeof claimedCredits>;
export type ClaimedCreditInsert = InferInsertModel<typeof claimedCredits>;
