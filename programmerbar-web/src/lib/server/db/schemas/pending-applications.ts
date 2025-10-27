import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const pendingApplications = sqliteTable(
	'pending_application',
	{
		id: text().notNull().primaryKey(),
		name: text().notNull(),
		email: text().notNull(),
		feideId: text().notNull(),
		createdAt: integer({ mode: 'timestamp' }).notNull()
	},
	(t) => [
		index('pending_application_email_idx').on(t.email),
		index('pending_application_feide_id_idx').on(t.feideId)
	]
);

export type PendingApplication = InferSelectModel<typeof pendingApplications>;
export type PendingApplicationInsert = InferInsertModel<typeof pendingApplications>;
