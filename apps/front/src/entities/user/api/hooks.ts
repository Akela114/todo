import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { createUser } from "./fetchers";
import type { CoreApiBasicResponse } from "@/shared/api/core-api/schemas";

export const useCreateUser = (
  opts: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof createUser>>,
      CoreApiBasicResponse,
      Parameters<typeof createUser>[0]
    >,
    "mutationFn"
  > = {}
) => {
  return useMutation({
    ...opts,
    mutationFn: createUser,
  });
};
