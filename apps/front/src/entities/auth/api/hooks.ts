import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { login, logout } from "./fetchers/base-fetchers";
import type { CoreApiBasicResponse } from "@/shared/api/core-api/schemas";

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
  return useMutation({
    ...opts,
    mutationFn: login,
  });
};

export const useLogout = (opts: Omit<UseMutationOptions, "mutationFn"> = {}) =>
  useMutation({
    ...opts,
    mutationFn: logout,
  });
