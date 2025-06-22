import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { login, logout } from "./fetchers/base-fetchers";
import type { CoreApiBasicResponse } from "@/shared/api/core-api/schemas";
import { QUERY_KEYS } from "@/shared/query/query-keys";
import { queryClient } from "@/shared/query/query-client";

export const useLogin = (
  opts: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof login>>,
      CoreApiBasicResponse,
      Parameters<typeof login>[0]
    >,
    "mutationFn"
  > = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: login,
    onSettled: (...args) => {
      opts.onSettled?.(...args);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authCheck] });
    },
  });
};

export const useLogout = (opts: Omit<UseMutationOptions, "mutationFn"> = {}) =>
  useMutation({
    ...opts,
    mutationFn: logout,
    onSettled: (...args) => {
      opts.onSettled?.(...args);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authCheck] });
    },
  });
