import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { groups } from './groups';
import { users } from './users';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

export const usersGroups = sqliteTable('users_groups', {
	userId: text('user_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade'
		}),
	groupId: text('group_id')
		.notNull()
		.references(() => groups.id, {
			onDelete: 'cascade'
		})
});

export const usersGroupsRelations = relations(usersGroups, ({ one }) => ({
	group: one(groups, {
		fields: [usersGroups.groupId],
		references: [groups.id]
	}),
	user: one(users, {
		fields: [usersGroups.userId],
		references: [users.id]
	})
}));

export type UsersGroups = InferSelectModel<typeof usersGroups>;
export type UsersGroupsInsert = InferInsertModel<typeof usersGroups>;
