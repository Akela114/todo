import { timestamps } from "@/lib/common-table-fields.js";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { user } from "../users/tables.js";

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
