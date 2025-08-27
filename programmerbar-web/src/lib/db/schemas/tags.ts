import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { users } from './users';

export const tags = sqliteTable(
	'tags',
	{
		id: text().primaryKey().$defaultFn(nanoid),
		name: text().notNull().unique(),
		description: text(),
		color: text(),
		// Tag options for notifications and permissions
		canSeeOpplearing: integer({ mode: 'boolean' }).notNull().default(false),
		canSeeBeerClaims: integer({ mode: 'boolean' }).notNull().default(false),
		canSeeEventDepartures: integer({ mode: 'boolean' }).notNull().default(false),
		canSeeReferrals: integer({ mode: 'boolean' }).notNull().default(false),
		canSeeBongs: integer({ mode: 'boolean' }).notNull().default(false),
		canManageTagOptions: integer({ mode: 'boolean' }).notNull().default(false),
		// New notification permissions
		canSeeUserChanges: integer({ mode: 'boolean' }).notNull().default(false),
		canSeeEventUpdates: integer({ mode: 'boolean' }).notNull().default(false),
		canSeeShiftUpdates: integer({ mode: 'boolean' }).notNull().default(false),
		canSeeTagChanges: integer({ mode: 'boolean' }).notNull().default(false),
		canSeeContactSubmissions: integer({ mode: 'boolean' }).notNull().default(false),
		canSeeNewcomers: integer({ mode: 'boolean' }).notNull().default(false),
		createdAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(t) => [index('idx_tags_name').on(t.name)]
);

export const userTags = sqliteTable(
	'user_tags',
	{
		id: text().primaryKey().$defaultFn(nanoid),
		userId: text()
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		tagId: text()
			.notNull()
			.references(() => tags.id, {
				onDelete: 'cascade'
			}),
		assignedBy: text()
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		createdAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(t) => [
		index('idx_user_tags_user_id').on(t.userId),
		index('idx_user_tags_tag_id').on(t.tagId),
		index('idx_user_tags_composite').on(t.userId, t.tagId)
	]
);

export const tagsRelations = relations(tags, ({ many }) => ({
	userTags: many(userTags)
}));

export const userTagsRelations = relations(userTags, ({ one }) => ({
	user: one(users, {
		fields: [userTags.userId],
		references: [users.id]
	}),
	tag: one(tags, {
		fields: [userTags.tagId],
		references: [tags.id]
	}),
	assignedByUser: one(users, {
		fields: [userTags.assignedBy],
		references: [users.id]
	})
}));

export type Tag = InferSelectModel<typeof tags>;
export type TagInsert = InferInsertModel<typeof tags>;
export type UserTag = InferSelectModel<typeof userTags>;
export type UserTagInsert = InferInsertModel<typeof userTags>;
