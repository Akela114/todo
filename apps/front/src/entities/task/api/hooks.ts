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
import { useOptimisticMutation } from "@/shared/query/query-helpers";
import type { Task } from "@packages/schemas/task";

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
  return useOptimisticMutation(
    {
      ...opts,
      mutationFn: modifyTask,
    },
    [QUERY_KEYS.tasks],
    (variables, prevData?: Task[]) => {
      if (prevData) {
        const newTasks = prevData.map((task) => {
          if (task.id === variables.urlParams) {
            return { ...task, ...variables.body } satisfies Task;
          }
          return task;
        });
        return newTasks;
      }
      return prevData;
    }
  );
};

export const useDeleteTask = () => {
  return useOptimisticMutation(
    { mutationFn: deleteTask },
    [QUERY_KEYS.tasks],
    (variables, prevData?: Task[]) => {
      if (prevData) {
        return prevData.filter((task) => task.id !== variables.urlParams);
      }
      return prevData;
    }
  );
};
