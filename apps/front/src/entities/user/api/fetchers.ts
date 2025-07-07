import {
  CORE_API_BASIC_RESPONSE_FALLBACK,
  coreApi,
  createFetcherWrapper,
  withHttpErrorParsing,
  withValidation,
} from "@/shared/api";
import { coreApiBasicResponseSchema } from "@packages/schemas/common";
import { type CreateOrModifyUser, userSchema } from "@packages/schemas/user";

export const createUser = withHttpErrorParsing(
  withValidation(
    createFetcherWrapper<undefined, undefined, CreateOrModifyUser>(
      coreApi,
      () => "users",
      "post",
    ),
    userSchema,
  ),
  coreApiBasicResponseSchema,
  CORE_API_BASIC_RESPONSE_FALLBACK,
);
