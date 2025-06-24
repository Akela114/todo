import { z } from "zod";

export const taskSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  done: z.boolean(),
  priority: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createTaskFromInboxEntrySchema = z.object({
  title: z.string().min(1),
  priority: z.number().min(0).max(2),
});

export const modifyTaskSchema = createTaskFromInboxEntrySchema
  .extend({
    done: z.boolean(),
  })
  .partial({
    done: true,
    priority: true,
    title: true,
  });

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskFromInboxEntry = z.infer<
  typeof createTaskFromInboxEntrySchema
>;
export type ModifyTask = z.infer<typeof modifyTaskSchema>;
