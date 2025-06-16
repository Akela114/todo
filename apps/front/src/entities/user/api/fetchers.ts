import { coreApi, createFetcherWrapper, withValidation } from "@/shared/api";
import { type CreateUser, userSchema } from "../model";

export const createUser = withValidation(
  createFetcherWrapper<undefined, undefined, CreateUser>(
    coreApi,
    () => "users",
    "post",
  ),
  userSchema,
);
