import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import type { task } from "@/db/schema.js";

export const taskSelectSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  done: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
}) satisfies z.ZodType<Omit<InferSelectModel<typeof task>, "userId">>;

export const taskCreateSchema = z.object({
  title: z.string(),
}) satisfies z.ZodType<Pick<InferInsertModel<typeof task>, "title">>;

export const taskUpdateSchema = z.object({
  title: z.string().optional(),
  done: z.boolean().optional(),
}) satisfies z.ZodType<
  Partial<Pick<InferInsertModel<typeof task>, "title" | "done">>
>;

export type TaskSelect = z.infer<typeof taskSelectSchema>;
export type TaskCreateOrUpdate = z.infer<typeof taskCreateSchema>;
