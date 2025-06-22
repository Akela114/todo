import { QUERY_KEYS } from "@/shared/query/query-keys";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  createTaskFromInboxEntry,
  deleteTask,
  getTasks,
  modifyTask,
} from "./fetchers";

export const useTasks = () =>
  useQuery({
    queryKey: [QUERY_KEYS.tasks],
    queryFn: () => getTasks(),
  });

export const useCreateTaskFromInboxEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskFromInboxEntry,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.tasks],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.inboxEntries],
      });
    },
  });
};

export const useModifyTask = (
  opts: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof modifyTask>>,
      unknown,
      Parameters<typeof modifyTask>[0]
    >,
    "mutationFn"
  > = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    mutationFn: modifyTask,
    onSettled: (...args) => {
      opts.onSettled?.(...args);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tasks] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tasks] });
    },
  });
};
