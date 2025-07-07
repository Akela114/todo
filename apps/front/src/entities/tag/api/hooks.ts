import { QUERY_KEYS } from "@/shared/query";
import type { CoreApiBasicResponse } from "@packages/schemas/common";
import {
  type UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createTag, getTags } from "./fetchers";

export const useTags = (
  searchParams: Parameters<typeof getTags>[0]["searchParams"] = {},
  keepPreviousData?: boolean,
) =>
  useQuery({
    queryKey: [QUERY_KEYS.tags, searchParams],
    queryFn: () => getTags({ searchParams }),
    placeholderData: keepPreviousData
      ? (previousData) => previousData
      : undefined,
  });

export const useCreateTag = (
  opts: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof createTag>>,
      CoreApiBasicResponse,
      Parameters<typeof createTag>[0]
    >,
    "mutationFn"
  > = {},
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof createTag>>,
    CoreApiBasicResponse,
    Parameters<typeof createTag>[0]
  >({
    ...opts,
    mutationFn: createTag,
    onSettled: (...args) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tags] });
      opts.onSettled?.(...args);
    },
  });
};
