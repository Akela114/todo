import { QUERY_KEYS, useOptimisticMutation } from "@/shared/query";
import type { CoreApiBasicResponse } from "@packages/schemas/common";
import type { Task } from "@packages/schemas/task";
import {
  type UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTaskFromInboxEntry,
  deleteTask,
  getTasks,
  modifyTask,
} from "./fetchers";

export const useTasks = (
  searchParams: Parameters<typeof getTasks>[0]["searchParams"],
  onSuccess?: (data: Awaited<ReturnType<typeof getTasks>>) => void,
  keepPreviousData?: boolean,
) =>
  useQuery({
    queryKey: [QUERY_KEYS.tasks, searchParams],
    queryFn: async () => {
      const data = await getTasks({
        searchParams,
      });
      onSuccess?.(data);
      return data;
    },
    placeholderData: keepPreviousData
      ? (previousData) => previousData
      : undefined,
  });

export const useCreateTaskFromInboxEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof createTaskFromInboxEntry>>,
    CoreApiBasicResponse,
    Parameters<typeof createTaskFromInboxEntry>[0]
  >({
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
      CoreApiBasicResponse,
      Parameters<typeof modifyTask>[0]
    >,
    "mutationFn"
  > = {},
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
    },
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
    },
  );
};
