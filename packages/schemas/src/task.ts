import { z } from "zod";
import {
  basePaginatedRequestParams,
  getPaginatedResponseSchema,
} from "./common";

export const taskSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  priority: z.number(),
  startDate: z.string().date(),
  doneDate: z.string().date().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedTasks = getPaginatedResponseSchema(taskSchema.array());
export const paginatedTasksQueryParams = basePaginatedRequestParams.extend({
  startFrom: z.string().date(),
});

export const createTaskFromInboxEntrySchema = z.object({
  title: z.string().min(1),
  priority: z.number().min(0).max(2),
  startDate: z.string().date(),
});

export const modifyTaskSchema = createTaskFromInboxEntrySchema
  .extend({
    doneDate: z.string().date().nullable(),
  })
  .partial({
    doneDate: true,
    priority: true,
    title: true,
    startDate: true,
  });

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskFromInboxEntry = z.infer<
  typeof createTaskFromInboxEntrySchema
>;
export type ModifyTask = z.infer<typeof modifyTaskSchema>;
export type PaginatedTasksQueryParams = z.infer<
  typeof paginatedTasksQueryParams
>;
