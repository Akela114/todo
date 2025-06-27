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
  endDate: z.string().date().nullable(),
  doneDate: z.string().date().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedTasks = getPaginatedResponseSchema(taskSchema.array());
export const paginatedTasksQueryParams = basePaginatedRequestParams.extend({
  startFrom: z.string().date(),
});

const createOrModifyTaskBaseSchema = z.object({
  title: z.string().min(1),
  priority: z.number().min(0).max(2),
  startDate: z.string().date(),
  endDate: z.string().date().nullable(),
});

export const createTaskFromInboxEntrySchema =
  createOrModifyTaskBaseSchema.refine(
    (data) => {
      return !data.endDate || data.endDate >= data.startDate;
    },
    { message: "End date should not be before start date", path: ["endDate"] },
  );

export const modifyTaskSchema = createOrModifyTaskBaseSchema
  .partial({
    title: true,
    priority: true,
    startDate: true,
    endDate: true,
  })
  .refine(
    (data) => {
      return !data.endDate || !data.startDate || data.endDate >= data.startDate;
    },
    { message: "End date should not be before start date", path: ["endDate"] },
  );

export const changeTaskStatusSchema = z.object({
  doneDate: z.string().date().nullable(),
});

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskFromInboxEntry = z.infer<
  typeof createTaskFromInboxEntrySchema
>;
export type ModifyTask = z.infer<typeof modifyTaskSchema>;
export type ChangeTaskStatus = z.infer<typeof changeTaskStatusSchema>;
export type PaginatedTasksQueryParams = z.infer<
  typeof paginatedTasksQueryParams
>;
