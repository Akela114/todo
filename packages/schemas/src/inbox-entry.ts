import { z } from "zod";
import { getPaginatedResponseSchema } from "./common";

export const inboxEntrySchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedInoxEntries = getPaginatedResponseSchema(
  inboxEntrySchema.array(),
);

export const createOrModifyInboxEntrySchema = z.object({
  title: z.string().min(1),
});

export type InboxEntry = z.infer<typeof inboxEntrySchema>;
export type CreateOrModifyInboxEntry = z.infer<
  typeof createOrModifyInboxEntrySchema
>;
