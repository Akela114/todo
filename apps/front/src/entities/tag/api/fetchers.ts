import { coreApiWithAuth } from "@/entities/auth/@x";
import {
  CORE_API_BASIC_RESPONSE_FALLBACK,
  createFetcherWrapper,
  withHttpErrorParsing,
  withValidation,
} from "@/shared/api";
import { coreApiBasicResponseSchema } from "@packages/schemas/common";
import {
  type CreateOrModifyTag,
  type TagsQueryParams,
  tagSchema,
} from "@packages/schemas/tag";

export const getTags = withValidation(
  createFetcherWrapper<undefined, TagsQueryParams>(
    coreApiWithAuth,
    () => "tags",
    "get",
  ),
  tagSchema.array(),
);

export const createTag = withHttpErrorParsing(
  withValidation(
    createFetcherWrapper<undefined, undefined, CreateOrModifyTag>(
      coreApiWithAuth,
      () => "tags",
      "post",
    ),
    tagSchema,
  ),
  coreApiBasicResponseSchema,
  CORE_API_BASIC_RESPONSE_FALLBACK,
);
