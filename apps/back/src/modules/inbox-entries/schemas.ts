import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import type { inboxEntry } from "@/db/schema.js";

export const inboxEntrySelectSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}) satisfies z.ZodType<Omit<InferSelectModel<typeof inboxEntry>, "userId">>;

export const inboxEntryCreateOrUpdateSchema = z.object({
  title: z.string(),
}) satisfies z.ZodType<Pick<InferInsertModel<typeof inboxEntry>, "title">>;
