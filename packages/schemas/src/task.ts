import { z } from "zod";

export const taskSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  done: z.boolean(),
  priority: z.coerce.number().min(0).max(2),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createTaskFromInboxEntrySchema = taskSchema.pick({
  title: true,
  priority: true,
});

export const modifyTaskSchema = taskSchema
  .pick({
    title: true,
    done: true,
    priority: true,
  })
  .partial({
    title: true,
    done: true,
    priority: true,
  });

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskFromInboxEntry = z.infer<
  typeof createTaskFromInboxEntrySchema
>;
export type ModifyTask = z.infer<typeof modifyTaskSchema>;
