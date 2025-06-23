import { z } from "zod";

export const inboxEntrySchema = z.object({
  id: z.number(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createOrModifyInboxEntrySchema = inboxEntrySchema.pick({
  title: true,
});

export type InboxEntry = z.infer<typeof inboxEntrySchema>;
export type CreateOrModifyInboxEntry = z.infer<
  typeof createOrModifyInboxEntrySchema
>;
