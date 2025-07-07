import { tagIdsSchema } from "@packages/schemas/tag";
import { z } from "zod";

export const LOCAL_STORAGE_SCHEMAS = {
  taskPageParams: {
    key: "params:/tasks",
    schema: z.object({
      tagIds: tagIdsSchema.optional(),
    }),
  },
} as const;
