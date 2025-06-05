import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { invoice } from './invoice'; 
import { events } from './events';
import { userShifts } from './user-shifts';

import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const booking = sqliteTable('booking', {
	id: text('id').primaryKey().$defaultFn(nanoid),
  name: text().notNull(),
	date: integer({ mode: 'timestamp' }).notNull(),
	nonAlcohol: integer({ mode: 'boolean' }).notNull().default(false),
  Bong: integer({ mode: 'boolean' }).notNull().default(false),
  Bouncers: integer({ mode: 'boolean' }).notNull().default(false),
  
  organizer: text().notNull(),
  contactName: text().notNull(),
  contactNr: text().notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const bookingRelations = relations(booking, ({ many }) => ({
	invoices: many(invoice)
}));

export type Booking = InferSelectModel<typeof booking>;
export type BookingInsert = InferInsertModel<typeof booking>;
