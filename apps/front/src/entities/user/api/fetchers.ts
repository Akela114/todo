import {
  coreApi,
  createFetcherWrapper,
  withHttpErrorParsing,
  withValidation,
  CORE_API_BASIC_RESPONSE_FALLBACK,
} from "@/shared/api";
import { type CreateUser, userSchema } from "@packages/schemas/user";
import { coreApiBasicResponseSchema } from "@packages/schemas/common";

export const createUser = withHttpErrorParsing(
  withValidation(
    createFetcherWrapper<undefined, undefined, CreateUser>(
      coreApi,
      () => "users",
      "post"
    ),
    userSchema
  ),
  coreApiBasicResponseSchema,
  CORE_API_BASIC_RESPONSE_FALLBACK
);
