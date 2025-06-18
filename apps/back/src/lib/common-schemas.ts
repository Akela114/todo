import { z } from "zod";

export const basicResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export type BasicResponse = z.infer<typeof basicResponseSchema>;
