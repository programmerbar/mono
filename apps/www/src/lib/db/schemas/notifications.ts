import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { users } from './users';

export const notifications = sqliteTable(
	'notification',
	{
		id: text().primaryKey().$defaultFn(nanoid),
		userId: text()
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		title: text().notNull(),
		body: text(),
		archivedAt: integer({ mode: 'timestamp' }),
		createdAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(t) => [
		index('idx_notifications_user_id').on(t.userId),
		index('idx_notifications_archived_at').on(t.archivedAt)
	]
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	})
}));

export type Notification = InferSelectModel<typeof notifications>;
export type NotificationInsert = InferInsertModel<typeof notifications>;
