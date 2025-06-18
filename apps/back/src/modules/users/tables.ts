import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text().notNull().unique(),
  email: text().notNull().unique(),
  passwordSalt: text().notNull(),
  passwordHash: text().notNull(),
});
