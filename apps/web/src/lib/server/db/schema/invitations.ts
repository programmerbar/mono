import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const invitationTable = sqliteTable('invitation', {
	id: text('id').notNull().primaryKey(),
	email: text('email').notNull(),
	expiresAt: integer('expires', { mode: 'timestamp' }).notNull(),
	redeemedAt: integer('redeemed_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export type Invitation = (typeof invitationTable)['$inferSelect'];
export type InvitationInsert = (typeof invitationTable)['$inferInsert'];
