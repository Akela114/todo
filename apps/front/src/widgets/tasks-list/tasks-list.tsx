import {
  TaskCard,
  TaskCardSkeleton,
  useModifyTask,
  useTasks,
} from "@/entities/task";
import { DeleteTaskButton, ModifyTaskButton } from "@/features/task";
import { useThrottledValue } from "@/shared/common-hooks/use-throttled-value";
import {
  FetchEmpty,
  FetchError,
  Match,
  SimpleList,
  SimpleListItem,
} from "@/shared/ui";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TasksListProps {
  children?: ReactNode;
  className?: string;
}

export const TasksList = ({ className, children }: TasksListProps) => {
  const { data: tasks, status, refetch } = useTasks();
  const { mutate: modifyTask } = useModifyTask();
  const throttledStatus = useThrottledValue(status, 500);

  return (
    <div className={twMerge("flex flex-col gap-4", className)}>
      {children && <div className="flex gap-2">{children}</div>}
      <Match
        value={throttledStatus}
        success={() =>
          tasks?.length ? (
            <SimpleList>
              {tasks.map((task) => (
                <SimpleListItem key={task.id}>
                  <TaskCard
                    data={task}
                    onStatusChange={(isDone) =>
                      modifyTask({ body: { done: isDone }, urlParams: task.id })
                    }
                  >
                    {!task.done && <ModifyTaskButton data={task} />}
                    <DeleteTaskButton data={task} />
                  </TaskCard>
                </SimpleListItem>
              ))}
            </SimpleList>
          ) : (
            <FetchEmpty>Список задач пуст</FetchEmpty>
          )
        }
        error={() => (
          <FetchError onRetry={() => refetch()}>
            Произошла ошибка при загрузке задач!
          </FetchError>
        )}
        pending={() => (
          <SimpleList>
            {Array.from({ length: 3 }).map((_, index) => (
              <SimpleListItem key={index}>
                <TaskCardSkeleton />
              </SimpleListItem>
            ))}
          </SimpleList>
        )}
      />
    </div>
  );
};
