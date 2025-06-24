import { coreApiWithAuth } from "@/entities/auth/@x";
import {
  CORE_API_BASIC_RESPONSE_FALLBACK,
  createFetcherWrapper,
  withHttpErrorParsing,
  withValidation,
} from "@/shared/api";
import { coreApiBasicResponseSchema } from "@packages/schemas/common";
import {
  type CreateOrModifyInboxEntry,
  inboxEntrySchema,
} from "@packages/schemas/inbox-entry";

export const getInboxEntries = withValidation(
  createFetcherWrapper(coreApiWithAuth, () => "inbox-entries", "get"),
  inboxEntrySchema.array()
);

export const createInboxEntry = withHttpErrorParsing(
  withValidation(
    createFetcherWrapper<undefined, undefined, CreateOrModifyInboxEntry>(
      coreApiWithAuth,
      () => "inbox-entries",
      "post"
    ),
    inboxEntrySchema
  ),
  coreApiBasicResponseSchema,
  CORE_API_BASIC_RESPONSE_FALLBACK
);

export const modifyInboxEntry = withHttpErrorParsing(
  withValidation(
    createFetcherWrapper<number, undefined, CreateOrModifyInboxEntry>(
      coreApiWithAuth,
      (id: number) => `inbox-entries/${id}`,
      "put"
    ),
    inboxEntrySchema
  ),
  coreApiBasicResponseSchema,
  CORE_API_BASIC_RESPONSE_FALLBACK
);

export const deleteInboxEntry = withValidation(
  createFetcherWrapper(
    coreApiWithAuth,
    (id: number) => `inbox-entries/${id}`,
    "delete"
  ),
  inboxEntrySchema
);
