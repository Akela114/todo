import {
  TaskCard,
  TaskCardSkeleton,
  useModifyTask,
  useTasks,
} from "@/entities/task";
import { DeleteTaskButton, ModifyTaskButton } from "@/features/task";
import { useThrottledValue } from "@/shared/hooks/use-throttled-value";
import { FetchEmpty } from "@/shared/ui/fetch-empty";
import { FetchError } from "@/shared/ui/fetch-error";
import { Match } from "@/shared/ui/match";
import { SimpleList } from "@/shared/ui/simple-list";
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
                <TaskCard
                  data={task}
                  key={task.id}
                  onStatusChange={(isDone) =>
                    modifyTask({ body: { done: isDone }, urlParams: task.id })
                  }
                >
                  {!task.done && <ModifyTaskButton data={task} />}
                  <DeleteTaskButton data={task} />
                </TaskCard>
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
              <TaskCardSkeleton key={index} />
            ))}
          </SimpleList>
        )}
      />
    </div>
  );
};
