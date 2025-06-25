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

const NUM_OF_SKELETONS = 3;

export const TasksList = ({ className, children }: TasksListProps) => {
  const { data: tasks, status, refetch } = useTasks();
  const { mutate: modifyTask } = useModifyTask();
  const throttledStatus = useThrottledValue(status, 300);

  return (
    <div className={twMerge("flex flex-col gap-4", className)}>
      {children && <div className="flex gap-2">{children}</div>}
      <Match
        value={throttledStatus}
        success={() =>
          tasks?.length ? (
            <SimpleList>
              {tasks.map((task, idx, tasks) => (
                <SimpleListItem
                  key={task.id}
                  initialAnimationDelayMultiplier={
                    idx < NUM_OF_SKELETONS ? 0 : idx - (NUM_OF_SKELETONS - 1)
                  }
                  isLastItem={idx === tasks.length - 1}
                >
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
            {Array.from({ length: NUM_OF_SKELETONS }).map((_, index) => (
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
