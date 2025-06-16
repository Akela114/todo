import { type UseMutateFunction, useMutation } from "@tanstack/react-query";
import { createUser } from "./fetchers";

export const useCreateUser = (
  opts: Omit<UseMutateFunction, "mutationFn"> = {},
) => {
  return useMutation({
    ...opts,
    mutationFn: createUser,
  });
};
