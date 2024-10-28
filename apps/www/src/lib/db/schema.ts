import { type InferSelectModel, relations } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

/**
 * Users
 */

export const users = sqliteTable(
	'user',
	{
		id: text('id').notNull().primaryKey(),
		name: text('name').notNull(),
		email: text('email').notNull(),
		feideId: text('feide_id')
	},
	(t) => ({
		emailIdx: uniqueIndex('email_idx').on(t.email),
		feideIdIdx: uniqueIndex('feide_id_idx').on(t.feideId)
	})
);

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	shifts: many(shifts)
}));

export type User = InferSelectModel<typeof users>;

/**
 * Sessions
 */

export const sessions = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull(),
	expiresAt: integer('expires').notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

/**
 * Invitations
 */

export const invitations = sqliteTable(
	'invitation',
	{
		id: text('id').notNull().primaryKey(),
		email: text('email').notNull(),
		usedAt: integer('claimed_at', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
	},
	(t) => ({
		emailIdx: uniqueIndex('invitation_email_idx').on(t.email)
	})
);

/**
 * Events
 */

export const events = sqliteTable('event', {
	id: text('id').notNull().primaryKey().$defaultFn(nanoid),
	name: text('name').notNull(),
	date: integer('date', { mode: 'timestamp' }).notNull()
});

export const eventsRelations = relations(events, ({ many }) => ({
	shifts: many(shifts)
}));

export type Event = InferSelectModel<typeof events>;

/**
 * Shifts
 */

export const shifts = sqliteTable('shift', {
	id: text('id').notNull().primaryKey().$defaultFn(nanoid),
	eventId: text('event_id').notNull(),
	start: integer('start', { mode: 'timestamp' }).notNull(),
	end: integer('end', { mode: 'timestamp' }).notNull()
});

export const shiftsRelations = relations(shifts, ({ one, many }) => ({
	event: one(events, {
		fields: [shifts.eventId],
		references: [events.id]
	}),
	members: many(userShifts)
}));

export type Shift = InferSelectModel<typeof shifts>;

/**
 * Users to shifts
 */

export const userShifts = sqliteTable('user_shift', {
	userId: text('user_id').notNull(),
	shiftId: text('shift_id').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
	isBeerClaimed: integer('is_beer_claimed', { mode: 'boolean' }).notNull().default(false),
	status: text('status', { enum: ['pending', 'accepted', 'denied'] })
		.notNull()
		.default('pending')
});

export const userShiftsRelations = relations(userShifts, ({ one }) => ({
	user: one(users, {
		fields: [userShifts.userId],
		references: [users.id]
	}),
	shift: one(shifts, {
		fields: [userShifts.shiftId],
		references: [shifts.id]
	})
}));

export type UserShift = InferSelectModel<typeof userShifts>;
