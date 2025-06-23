import { z } from "zod";

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  done: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createTaskFromInboxEntrySchema = taskSchema.pick({
  title: true,
});

export const modifyTaskSchema = taskSchema
  .pick({
    title: true,
    done: true,
  })
  .partial({
    title: true,
    done: true,
  });

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskFromInboxEntry = z.infer<
  typeof createTaskFromInboxEntrySchema
>;
export type ModifyTask = z.infer<typeof modifyTaskSchema>;
