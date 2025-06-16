import { z } from "zod";

export const coreApiBasicResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export type CoreApiBasicResponse = z.infer<typeof coreApiBasicResponseSchema>;
