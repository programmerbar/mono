import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const claimedCredits = sqliteTable('claimed_credits', {
	id: text().primaryKey(),
	userId: text()
		.notNull()
		.references(() => users.id),
	productId: text().notNull(),
	creditCost: integer().notNull(),
	createdAt: integer({ mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export type ClaimedCredit = InferSelectModel<typeof claimedCredits>;
export type ClaimedCreditInsert = InferInsertModel<typeof claimedCredits>;
