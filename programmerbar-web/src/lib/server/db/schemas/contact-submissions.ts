import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const contactSubmissions = sqliteTable('contact_submission', {
	id: text().notNull().primaryKey(),
	name: text().notNull(),
	email: text().notNull(),
	message: text().notNull(),
	submittedAt: integer({ mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	ipAddress: text()
});

export type ContactSubmission = InferSelectModel<typeof contactSubmissions>;
export type ContactSubmissionInsert = InferInsertModel<typeof contactSubmissions>;
