import {
  TaskCard,
  TaskCardSkeleton,
  useModifyTask,
  useTasks,
} from "@/entities/task";
import { DeleteTaskButton, ModifyTaskButton } from "@/features/task";
import { useThrottledValue } from "@/shared/common-hooks";
import {
  FetchEmpty,
  FetchError,
  Match,
  Pagination,
  PaginationSkeleton,
  SimpleList,
  SimpleListItem,
} from "@/shared/ui";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TasksListProps {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  renderPageLink: (page: number, className?: string) => ReactNode;
  children?: ReactNode;
  className?: string;
}

export const TasksList = ({
  className,
  children,
  page,
  pageSize,
  onPageChange,
  renderPageLink,
}: TasksListProps) => {
  const {
    data: tasks,
    status,
    refetch,
  } = useTasks({ page, pageSize }, (tasks) => {
    if (tasks.pagination.page > 1 && !tasks.data.length) {
      onPageChange(1);
    }
  });
  const { mutate: modifyTask } = useModifyTask();
  const throttledStatus = useThrottledValue(status, 300);

  return (
    <div className={twMerge("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2 flex-1">{children}</div>
        <Match
          value={throttledStatus}
          success={() =>
            tasks?.pagination ? (
              <Pagination
                page={tasks.pagination.page}
                renderPaginationElement={renderPageLink}
                totalCount={tasks.pagination.totalCount}
                pageSize={tasks.pagination.pageSize}
              />
            ) : null
          }
          pending={() => <PaginationSkeleton />}
        />
      </div>
      <Match
        value={throttledStatus}
        success={() =>
          tasks?.data.length ? (
            <SimpleList>
              {tasks.data.map((task) => (
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
            {Array.from({ length: pageSize }).map((_, idx) => (
              <SimpleListItem key={idx}>
                <TaskCardSkeleton />
              </SimpleListItem>
            ))}
          </SimpleList>
        )}
      />
    </div>
  );
};
