import { z } from "zod";
import { REGEXES } from "@packages/regexes";

export const userSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(16).regex(REGEXES.username),
});

export const createUserSchema = userSchema.extend({
  password: z.string().min(8).regex(REGEXES.password),
});

export type User = z.infer<typeof userSchema>;

export type CreateUser = z.infer<typeof createUserSchema>;
