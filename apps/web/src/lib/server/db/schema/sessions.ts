import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { userTable } from '.';
import { relations } from 'drizzle-orm';

export const sessionTable = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at').notNull()
});

export const sessionTableRelations = relations(sessionTable, ({ one }) => {
	return {
		user: one(userTable, {
			fields: [sessionTable.userId],
			references: [userTable.id]
		})
	};
});

export type Session = (typeof sessionTable)['$inferSelect'];
export type SessionInsert = (typeof sessionTable)['$inferInsert'];
