import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { users } from './users';
import { tags } from './tags';

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
		tagId: text().references(() => tags.id, {
			onDelete: 'set null'
		}),
		archivedAt: integer({ mode: 'timestamp' }),
		createdAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(t) => [
		index('idx_notifications_user_id').on(t.userId),
		index('idx_notifications_archived_at').on(t.archivedAt),
		index('idx_notifications_tag_id').on(t.tagId)
	]
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
	tag: one(tags, {
		fields: [notifications.tagId],
		references: [tags.id]
	})
}));

export type Notification = InferSelectModel<typeof notifications>;
export type NotificationInsert = InferInsertModel<typeof notifications>;
