import { z } from "zod";
import {
  basePaginatedRequestParams,
  getPaginatedResponseSchema,
} from "./common";

export const repetitionRuleSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("weekDays"),
    weekDays: z.array(z.number().min(0).max(6)).min(1),
  }),
  z.object({
    type: z.literal("monthDays"),
    monthDays: z.array(z.number().min(1).max(31)).min(1),
  }),
  z.object({
    type: z.literal("interval"),
    interval: z.coerce.number().min(1),
  }),
]);

export const taskSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  priority: z.number(),
  startDate: z.string().date(),
  endDate: z.string().date().nullable(),
  doneDate: z.string().date().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  repetitionRule: repetitionRuleSchema.nullable(),
});

export const paginatedTasks = getPaginatedResponseSchema(taskSchema.array());
export const paginatedTasksQueryParams = basePaginatedRequestParams.extend({
  startFrom: z.string().date(),
});

export const createOrModifyTaskSchema = z
  .object({
    title: z.string().min(1),
    priority: z.number().min(0).max(2),
    startDate: z.string().date(),
    endDate: z.string().date().nullable(),
    repetitionRule: repetitionRuleSchema.nullable(),
  })
  .refine(
    (data) => {
      return !data.endDate || data.endDate >= data.startDate;
    },
    { message: "End date should not be before start date", path: ["endDate"] },
  );

export const changeTaskStatusSchema = z.object({
  doneDate: z.string().date().nullable(),
});

export type RepetitionRule = z.infer<typeof repetitionRuleSchema>;
export type Task = z.infer<typeof taskSchema>;
export type CreateOrModifyTask = z.infer<typeof createOrModifyTaskSchema>;
export type ChangeTaskStatus = z.infer<typeof changeTaskStatusSchema>;
export type PaginatedTasksQueryParams = z.infer<
  typeof paginatedTasksQueryParams
>;
