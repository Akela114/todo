import { REGEXES } from "@packages/regexes";
import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(16).regex(REGEXES.username),
});

export const createOrModifyUserSchema = userSchema.extend({
  password: z.string().min(8).regex(REGEXES.password),
});

export type User = z.infer<typeof userSchema>;

export type CreateOrModifyUser = z.infer<typeof createOrModifyUserSchema>;
