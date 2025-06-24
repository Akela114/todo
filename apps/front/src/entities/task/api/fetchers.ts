import { coreApiWithAuth } from "@/entities/auth/@x";
import {
  CORE_API_BASIC_RESPONSE_FALLBACK,
  createFetcherWrapper,
  withHttpErrorParsing,
  withValidation,
} from "@/shared/api";
import { coreApiBasicResponseSchema } from "@packages/schemas/common";
import {
  type CreateTaskFromInboxEntry,
  type ModifyTask,
  taskSchema,
} from "@packages/schemas/task";

export const getTasks = withValidation(
  createFetcherWrapper(coreApiWithAuth, () => "tasks", "get"),
  taskSchema.array()
);

export const createTaskFromInboxEntry = withHttpErrorParsing(
  withValidation(
    createFetcherWrapper<number, undefined, CreateTaskFromInboxEntry>(
      coreApiWithAuth,
      (id: number) => `inbox-entries/${id}/tasks`,
      "post"
    ),
    taskSchema
  ),
  coreApiBasicResponseSchema,
  CORE_API_BASIC_RESPONSE_FALLBACK
);

export const modifyTask = withHttpErrorParsing(
  withValidation(
    createFetcherWrapper<number, undefined, ModifyTask>(
      coreApiWithAuth,
      (id: number) => `tasks/${id}`,
      "put"
    ),
    taskSchema
  ),
  coreApiBasicResponseSchema,
  CORE_API_BASIC_RESPONSE_FALLBACK
);

export const deleteTask = withValidation(
  createFetcherWrapper(
    coreApiWithAuth,
    (id: number) => `tasks/${id}`,
    "delete"
  ),
  taskSchema
);
