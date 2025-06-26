import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useOptimisticMutation = <Data, T, U, V>(
  opts: UseMutationOptions<T, U, V>,
  queryKey: string[],
  getNewData: (variables: V, prevData?: Data) => Data | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...opts,
    onMutate: async (variables) => {
      opts.onMutate?.(variables);
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      const newInboxEntries = getNewData(variables, previousData as Data);

      if (newInboxEntries) {
        queryClient.setQueryData(queryKey, newInboxEntries);
      }

      return { previousData };
    },
    onSettled: (...args) => {
      opts.onSettled?.(...args);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (...args) => {
      opts.onError?.(...args);
      queryClient.setQueryData(queryKey, args[2]?.previousData);
    },
  });
};
