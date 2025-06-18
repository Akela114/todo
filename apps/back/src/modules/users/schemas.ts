import type { user } from "@/db/schema.js";
import { REGEXES } from "@/lib/constants/regexes.js";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export const userSelectSchema = z.object({
  id: z.coerce.number(),
  username: z.string(),
  email: z.string().email(),
}) satisfies z.ZodType<
  Omit<InferSelectModel<typeof user>, "passwordSalt" | "passwordHash">
>;

export const userCreateSchema = z.object({
  username: z.string().min(3).max(16).regex(REGEXES.username),
  email: z.string().email(),
  password: z.string().min(8).regex(REGEXES.password),
}) satisfies z.ZodType<
  Pick<InferInsertModel<typeof user>, "username" | "email">
>;

export type UserSelect = z.infer<typeof userSelectSchema>;
export type UserCreate = z.infer<typeof userCreateSchema>;
