import { QUERY_KEYS } from "@/shared/query/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInboxEntry,
  deleteInboxEntry,
  getInboxEntries,
  modifyInboxEntry,
} from "./fetchers";

export const useInboxEntries = () =>
  useQuery({
    queryKey: [QUERY_KEYS.todos],
    queryFn: () => getInboxEntries(),
  });

export const useCreateInboxEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInboxEntry,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.todos] });
    },
  });
};

export const useModifyInboxEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: modifyInboxEntry,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.todos] });
    },
  });
};

export const useDeleteInboxEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInboxEntry,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.todos] });
    },
  });
};
