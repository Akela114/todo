import { REGEXES } from "@packages/regexes";
import { z } from "zod";
import { forceArray } from "./common";

export const tagsBaseSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
});

export const tagSchema = tagsBaseSchema.extend({
  tasksCount: z.number(),
});

export const tagIdsSchema = z.array(z.coerce.number());

export const tagsQueryParamsSchema = z.object({
  query: z.string().optional(),
  activeTagIds: forceArray(tagIdsSchema).optional(),
  startFrom: z.string().date().optional(),
});

export const createOrModifyTagSchema = z.object({
  name: z.string().min(1).regex(REGEXES.tag),
});

export type TagsBase = z.infer<typeof tagsBaseSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type TagsQueryParams = z.infer<typeof tagsQueryParamsSchema>;
export type TagIds = z.infer<typeof tagIdsSchema>;
export type CreateOrModifyTag = z.infer<typeof createOrModifyTagSchema>;
