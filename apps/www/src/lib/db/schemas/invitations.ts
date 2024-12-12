import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const invitations = sqliteTable(
	'invitation',
	{
		id: text().notNull().primaryKey(),
		email: text().notNull(),
		claimedAt: integer({ mode: 'timestamp' }),
		createdAt: integer({ mode: 'timestamp' }).notNull(),
		expiresAt: integer({ mode: 'timestamp' }).notNull()
	},
	(t) => [uniqueIndex('invitation_email_idx').on(t.email)]
);

export type Invitation = InferSelectModel<typeof invitations>;
export type InvitationInsert = InferInsertModel<typeof invitations>;
