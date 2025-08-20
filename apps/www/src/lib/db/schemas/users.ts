import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { sessions } from './sessions';
import { shifts } from './shifts';
import { usersGroups } from './users-groups';
import { notifications } from './notifications';
import { referrals } from './referrals';

export const users = sqliteTable(
	'user',
	{
		id: text().notNull().primaryKey(),
		name: text().notNull(),
		email: text().notNull(),
		feideId: text(),
		role: text({ enum: ['board', 'normal'] })
			.notNull()
			.default('normal'),
		additionalBeers: integer().default(0).notNull(),
		altEmail: text(),
		phone: text(),
		isDeleted: integer({ mode: 'boolean' }).default(false).notNull()
	},
	(t) => [uniqueIndex('email_idx').on(t.email), uniqueIndex('feide_id_idx').on(t.feideId)]
);

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	shifts: many(shifts),
	memberships: many(usersGroups),
	notifications: many(notifications),
	referralsGiven: many(referrals, { relationName: 'referrer' }),
	referralsReceived: many(referrals, { relationName: 'referred' })
}));

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
