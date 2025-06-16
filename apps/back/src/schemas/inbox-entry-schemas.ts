import type { inboxEntry } from "@/db/schema.js";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export const inboxEntrySelectSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}) satisfies z.ZodType<Omit<InferSelectModel<typeof inboxEntry>, "userId">>;

export const inboxEntryCreateOrUpdateSchema = z.object({
  title: z.string(),
}) satisfies z.ZodType<Omit<InferInsertModel<typeof inboxEntry>, "userId">>;

export type InboxEntrySelect = z.infer<typeof inboxEntrySelectSchema>;
export type InboxEntryCreateOrUpdate = z.infer<
  typeof inboxEntryCreateOrUpdateSchema
>;
