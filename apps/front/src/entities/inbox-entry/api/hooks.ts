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
import type { InboxEntry } from "../model";
import { useOptimisticMutation } from "@/shared/query/query-helpers";

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
  return useOptimisticMutation(
    {
      ...opts,
      mutationFn: modifyInboxEntry,
    },
    [QUERY_KEYS.inboxEntries],
    (variables, prevData?: InboxEntry[]) => {
      if (prevData) {
        const newInboxEntries = prevData.map((inboxEntry) => {
          if (inboxEntry.id === variables.urlParams) {
            return { ...inboxEntry, ...variables.body } satisfies InboxEntry;
          }
          return inboxEntry;
        });
        return newInboxEntries;
      }
      return prevData;
    }
  );
};

export const useDeleteInboxEntry = () => {
  return useOptimisticMutation(
    { mutationFn: deleteInboxEntry },
    [QUERY_KEYS.inboxEntries],
    (variables, prevData?: InboxEntry[]) => {
      if (prevData) {
        return prevData.filter(
          (inboxEntry) => inboxEntry.id !== variables.urlParams
        );
      }
      return prevData;
    }
  );
};
