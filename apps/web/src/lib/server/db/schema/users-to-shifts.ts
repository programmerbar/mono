import { relations } from 'drizzle-orm';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { shiftTable, userTable } from '.';

export const usersToShiftsTable = sqliteTable(
	'users_to_shifts',
	{
		userId: text('user_id').notNull(),
		shiftId: text('shift_id').notNull()
	},
	(t) => {
		return {
			pk: primaryKey({ columns: [t.userId, t.shiftId] })
		};
	}
);

export const usersToShiftsTableRelations = relations(usersToShiftsTable, ({ one }) => {
	return {
		shift: one(shiftTable, {
			fields: [usersToShiftsTable.shiftId],
			references: [shiftTable.id]
		}),
		user: one(userTable, {
			fields: [usersToShiftsTable.userId],
			references: [userTable.id]
		})
	};
});

export type UsersToShifts = (typeof usersToShiftsTable)['$inferSelect'];
export type UsersToShiftsInsert = (typeof usersToShiftsTable)['$inferInsert'];
