import type { drizzle } from "drizzle-orm/node-postgres";

declare global {
  type DB = ReturnType<typeof drizzle>;
}
