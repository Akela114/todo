import { QUERY_KEYS, useOptimisticMutation } from "@/shared/query";
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
import type { InboxEntry } from "@packages/schemas/inbox-entry";
import type { CoreApiBasicResponse } from "@packages/schemas/common";

export const useInboxEntries = (
  searchParams: Parameters<typeof getInboxEntries>[0]["searchParams"],
  onSuccess?: (data: Awaited<ReturnType<typeof getInboxEntries>>) => void
) =>
  useQuery({
    queryKey: [QUERY_KEYS.inboxEntries, searchParams],
    queryFn: async () => {
      const data = await getInboxEntries({
        searchParams,
      });
      onSuccess?.(data);
      return data;
    },
  });

export const useCreateInboxEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof createInboxEntry>>,
    CoreApiBasicResponse,
    Parameters<typeof createInboxEntry>[0]
  >({
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
      CoreApiBasicResponse,
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
