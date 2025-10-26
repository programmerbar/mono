import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { users } from './users';

export const pushSubscriptions = sqliteTable(
	'push_subscription',
	{
		id: text().primaryKey().$defaultFn(nanoid),
		userId: text()
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		endpoint: text().notNull().unique(),
		p256dh: text().notNull(),
		auth: text().notNull(),
		createdAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		lastUsedAt: integer({ mode: 'timestamp' })
	},
	(t) => [index('idx_push_subscriptions_user_id').on(t.userId)]
);

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
	user: one(users, {
		fields: [pushSubscriptions.userId],
		references: [users.id]
	})
}));

export type PushSubscription = InferSelectModel<typeof pushSubscriptions>;
export type PushSubscriptionInsert = InferInsertModel<typeof pushSubscriptions>;
