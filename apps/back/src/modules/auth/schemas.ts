import { z } from "zod";

export const authTokensSchema = z.object({
  accessToken: z.string(),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type AuthTokens = z.infer<typeof authTokensSchema>;

export type Login = z.infer<typeof loginSchema>;
