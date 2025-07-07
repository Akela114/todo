import type { RepetitionRule } from "@packages/schemas/task";
import { sql } from "drizzle-orm";
import {
  date,
  foreignKey,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
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

export const task = pgTable(
  "task",
  {
    ...timestamps,
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    priority: integer().notNull().default(1),
    startDate: date({ mode: "string" }).notNull(),
    endDate: date({ mode: "string" }),
    doneDate: date({ mode: "string" }),
    repetitionRule: jsonb().$type<RepetitionRule>(),
    userId: integer()
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
    parentTaskId: integer().unique(),
  },
  (table) => [
    foreignKey({
      columns: [table.parentTaskId],
      foreignColumns: [table.id],
      name: "task_parent_task_id_fkey",
    }),
  ],
);

export const tag = pgTable(
  "tag",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    userId: integer()
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [unique().on(table.userId, table.name)],
);

export const taskTag = pgTable(
  "taskTag",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer()
      .notNull()
      .references(() => task.id, {
        onDelete: "cascade",
      }),
    tagId: integer()
      .notNull()
      .references(() => tag.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [unique().on(table.taskId, table.tagId)],
);
