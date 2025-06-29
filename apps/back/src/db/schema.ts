import { sql } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp({ withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
};

export const user = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text().notNull().unique(),
  email: text().notNull().unique(),
  passwordSalt: text().notNull(),
  passwordHash: text().notNull(),
});

export const inboxEntry = pgTable("inboxEntry", {
  ...timestamps,
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  userId: integer()
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
});

export const task = pgTable("task", {
  ...timestamps,
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  priority: integer().notNull().default(1),
  startDate: date({ mode: "string" }).notNull(),
  endDate: date({ mode: "string" }),
  doneDate: date({ mode: "string" }),
  userId: integer()
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
});
