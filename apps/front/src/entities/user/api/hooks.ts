import type { CoreApiBasicResponse } from "@packages/schemas/common";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { createUser } from "./fetchers";

export const useCreateUser = (
  opts: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof createUser>>,
      CoreApiBasicResponse,
      Parameters<typeof createUser>[0]
    >,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    ...opts,
    mutationFn: createUser,
  });
};
