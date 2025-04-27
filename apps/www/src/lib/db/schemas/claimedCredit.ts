import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const claimedCredits = sqliteTable('claimed_credits', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	productId: text('product_id').notNull(),
	creditCost: integer('credit_cost').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export type ClaimedCredit = InferSelectModel<typeof claimedCredits>;
export type ClaimedCreditInsert = InferInsertModel<typeof claimedCredits>;
