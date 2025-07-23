import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'; 

export const referrals = sqliteTable('referral', { 
	id: text('id').primaryKey(),
	referredBy: text().notNull().references(() => users.id), 
	referred: text().notNull().references(() => users.id), 
	status: text({ enum: ['pending', 'completed', 'expired'] })
		.notNull()
		.default('pending'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	completedAt: integer({ mode: 'timestamp' })
});

export const referralsRelations = relations(referrals, ({ one }) => ({
	referrer: one(users, { 
		fields: [referrals.referredBy],
		references: [users.id],
		relationName: 'referrer'
	}),
	referred: one(users, {
		fields: [referrals.referred], 
		references: [users.id],
		relationName: 'referred'
	})
}));

export type Referral = InferSelectModel<typeof referrals>; 
export type ReferralInsert = InferInsertModel<typeof referrals>; 
