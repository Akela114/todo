import { sql } from "drizzle-orm";
import {
  boolean,
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
  done: boolean().notNull().default(false),
  priority: integer().notNull().default(1),
  userId: integer()
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
});
