import { z } from "zod";

export const coreApiBasicResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export const getPaginatedResponseSchema = <
  T extends z.ZodTypeAny | z.ZodArray<z.ZodTypeAny>,
>(
  schema: T,
) => {
  return z.object({
    data: schema,
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      totalCount: z.number(),
    }),
  });
};

export const basePaginatedRequestParams = z.object({
  page: z.coerce.number().min(1),
  pageSize: z.coerce.number().min(1),
});

export type CoreApiBasicResponse = z.infer<typeof coreApiBasicResponseSchema>;

export type BasePaginatedRequestParams = z.infer<
  typeof basePaginatedRequestParams
>;
