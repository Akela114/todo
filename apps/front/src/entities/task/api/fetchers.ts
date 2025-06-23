import { coreApiWithAuth } from "@/entities/auth/@x";
import { createFetcherWrapper, withValidation } from "@/shared/api";
import {
  type CreateTaskFromInboxEntry,
  type ModifyTask,
  taskSchema,
} from "@packages/schemas/task";

export const getTasks = withValidation(
  createFetcherWrapper(coreApiWithAuth, () => "tasks", "get"),
  taskSchema.array()
);

export const createTaskFromInboxEntry = withValidation(
  createFetcherWrapper<number, undefined, CreateTaskFromInboxEntry>(
    coreApiWithAuth,
    (id: number) => `inbox-entries/${id}/tasks`,
    "post"
  ),
  taskSchema
);

export const modifyTask = withValidation(
  createFetcherWrapper<number, undefined, ModifyTask>(
    coreApiWithAuth,
    (id: number) => `tasks/${id}`,
    "put"
  ),
  taskSchema
);

export const deleteTask = withValidation(
  createFetcherWrapper(
    coreApiWithAuth,
    (id: number) => `tasks/${id}`,
    "delete"
  ),
  taskSchema
);
