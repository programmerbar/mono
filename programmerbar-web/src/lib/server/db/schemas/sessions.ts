import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { users } from './users';

export const sessions = sqliteTable('session', {
	id: text().primaryKey(),
	userId: text().notNull(),
	expiresAt: integer().notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export type Session = InferSelectModel<typeof sessions>;
export type SessionInsert = InferInsertModel<typeof sessions>;
