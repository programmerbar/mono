import { type InferSelectModel, relations } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

/**
 * Users
 */

export const users = sqliteTable(
	'user',
	{
		id: text('id').notNull().primaryKey(),
		name: text('name').notNull(),
		email: text('email').notNull(),
		feideId: text('feide_id')
	},
	(t) => ({
		emailIdx: uniqueIndex('email_idx').on(t.email),
		feideIdIdx: uniqueIndex('feide_id_idx').on(t.feideId)
	})
);

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions)
}));

export type User = InferSelectModel<typeof users>;

/**
 * Sessions
 */

export const sessions = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires').notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

/**
 * Invitations
 */

export const invitations = sqliteTable(
	'invitation',
	{
		id: text('id').notNull().primaryKey(),
		email: text('email').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
	},
	(t) => ({
		emailIdx: uniqueIndex('invitation_email_idx').on(t.email)
	})
);
