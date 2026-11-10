import { date, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * The database tables. To add or change a field, edit this file and run
 * `npm run db:generate`, which writes a migration into /drizzle.
 * The migration runs automatically on the next deploy.
 */
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("todo"),
  owner: text("owner"),
  dueDate: date("due_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
