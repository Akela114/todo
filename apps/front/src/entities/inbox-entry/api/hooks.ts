import { QUERY_KEYS } from "@/shared/query/query-keys";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  createInboxEntry,
  deleteInboxEntry,
  getInboxEntries,
  modifyInboxEntry,
} from "./fetchers";

export const useInboxEntries = () =>
  useQuery({
    queryKey: [QUERY_KEYS.inboxEntries],
    queryFn: () => getInboxEntries(),
  });

export const useCreateInboxEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInboxEntry,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.inboxEntries] });
    },
  });
};

export const useModifyInboxEntry = (
  opts: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof modifyInboxEntry>>,
      unknown,
      Parameters<typeof modifyInboxEntry>[0]
    >,
    "mutationFn"
  > = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: modifyInboxEntry,
    onSettled: (...args) => {
      opts.onSettled?.(...args);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.inboxEntries] });
    },
  });
};

export const useDeleteInboxEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInboxEntry,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.inboxEntries] });
    },
  });
};
