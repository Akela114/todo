import {
  coreApi,
  createFetcherWrapper,
  withHttpErrorParsing,
  withValidation,
} from "@/shared/api";
import { type CreateUser, userSchema } from "../model";
import { coreApiBasicResponseSchema } from "@/shared/api/core-api/schemas";
import { CORE_API_BASIC_RESPONSE_FALLBACK } from "@/shared/api/core-api/consts";

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
