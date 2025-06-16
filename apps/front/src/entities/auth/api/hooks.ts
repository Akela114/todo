import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { login, logout } from "./fetchers/base-fetchers";

export const useLogin = (
  opts: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof login>>,
      unknown,
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
