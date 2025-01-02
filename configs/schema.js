import { pgTable, boolean, serial, varchar, json, integer, text, timestamp, decimal } from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable('users', {
  id: serial().primaryKey(),
  userName: varchar(),
  email: varchar().notNull(),
  role: varchar().default('user'),
  userId: varchar()
});

export const LEADS_TABLE = pgTable('leads', {
  id: serial('id').primaryKey(),
  restaurantName: varchar('restaurant_name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('New'),
  contactPerson: varchar('contact_person', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const ADDITIONAL_CONTACTS_TABLE = pgTable('additional_contacts', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').notNull(),
  contactPerson: varchar('contact_person', { length: 255 }).notNull(),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  role: varchar('role', { length: 100 }).notNull(),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


export const ORDERS_TABLE = pgTable('orders', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').notNull(),
  orderDate: timestamp('order_date').defaultNow(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('Pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const INTERACTIONS_TABLE = pgTable('interactions', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').notNull(),
  contactId: integer('contact_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'call', 'email', or 'text'
  status: varchar('status', { length: 50 }).notNull(), // 'completed', 'failed', etc.
  notes: text('notes'),
  duration: integer('duration'), // in seconds, for calls
  rating: integer('rating'), // 1-5 star rating
  orderId: integer('order_id'), // Optional, references the ORDERS_TABLE
  createdAt: timestamp('created_at').defaultNow(),
});

export const POTENTIAL_ORDERS_TABLE = pgTable('potential_orders', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').notNull(),
  expectedDate: timestamp('expected_date').notNull(),
  estimatedAmount: decimal('estimated_amount', { precision: 10, scale: 2 }),
  probability: integer('probability'), // 1-100
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


export const SCHEDULED_CALLS_TABLE = pgTable('scheduled_calls', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').notNull(),
  contactId: integer('contact_id').notNull(),
  scheduledDate: timestamp('scheduled_date').notNull(),
  duration: integer('duration').notNull(), // in minutes
  notes: text('notes'),
  status: varchar('status', { length: 50 }).notNull().default('scheduled'), // scheduled, completed, cancelled
  reminderSent: boolean('reminder_sent').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
