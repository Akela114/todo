import { coreApiWithAuth } from "@/entities/auth/@x";
import { createFetcherWrapper, withValidation } from "@/shared/api";
import {
  type CreateOrModifyInboxEntry,
  inboxEntrySchema,
} from "@packages/schemas/inbox-entry";

export const getInboxEntries = withValidation(
  createFetcherWrapper(coreApiWithAuth, () => "inbox-entries", "get"),
  inboxEntrySchema.array()
);

export const createInboxEntry = withValidation(
  createFetcherWrapper<undefined, undefined, CreateOrModifyInboxEntry>(
    coreApiWithAuth,
    () => "inbox-entries",
    "post"
  ),
  inboxEntrySchema
);

export const modifyInboxEntry = withValidation(
  createFetcherWrapper<number, undefined, CreateOrModifyInboxEntry>(
    coreApiWithAuth,
    (id: number) => `inbox-entries/${id}`,
    "put"
  ),
  inboxEntrySchema
);

export const deleteInboxEntry = withValidation(
  createFetcherWrapper(
    coreApiWithAuth,
    (id: number) => `inbox-entries/${id}`,
    "delete"
  ),
  inboxEntrySchema
);
