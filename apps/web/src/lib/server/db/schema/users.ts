import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sessionTable } from './sessions';
import { shiftTable } from '.';

export const userTable = sqliteTable('user', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	feideId: text('feide_id').notNull().unique(),
	type: text('type', { enum: ['user', 'admin'] })
		.notNull()
		.default('user')
});

export const userTableRelations = relations(userTable, ({ many }) => {
	return {
		sessions: many(sessionTable),
		shifts: many(shiftTable)
	};
});

export type User = (typeof userTable)['$inferSelect'];
export type UserInsert = (typeof userTable)['$inferInsert'];
