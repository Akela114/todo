import {
  TaskCard,
  TaskCardSkeleton,
  useModifyTask,
  useTasks,
} from "@/entities/task";
import { DeleteTaskButton, ModifyTaskButton } from "@/features/task";
import { formatDate } from "@/shared/common-helpers";
import { useThrottledValue } from "@/shared/common-hooks";
import {
  DaySelection,
  FetchEmpty,
  FetchError,
  Match,
  Pagination,
  PaginationSkeleton,
  SimpleList,
  SimpleListItem,
} from "@/shared/ui";
import { min } from "date-fns";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TasksListProps {
  page: number;
  pageSize: number;
  date: Date;
  onPageChange: (page: number) => void;
  onDateChange: (date?: Date) => void;
  renderPageLink: (page: number, className?: string) => ReactNode;
  children?: ReactNode;
  className?: string;
}

export const TasksList = ({
  className,
  page,
  pageSize,
  date,
  onPageChange,
  onDateChange,
  renderPageLink,
}: TasksListProps) => {
  const {
    data: tasks,
    status,
    refetch,
  } = useTasks({ page, pageSize, startFrom: formatDate(date) }, (tasks) => {
    if (tasks.pagination.page > 1 && !tasks.data.length) {
      onPageChange(1);
    }
  });
  const { mutate: modifyTask } = useModifyTask();
  const throttledStatus = useThrottledValue(status, 300);

  const handleTaskStatusChange = (taskId: number, isDone: boolean) => {
    const currentDateOrToday = min([new Date(), date]);
    modifyTask({
      body: {
        doneDate: isDone ? formatDate(currentDateOrToday) : null,
      },
      urlParams: taskId,
    });
  };

  return (
    <div className={twMerge("flex flex-col gap-4", className)}>
      <div className="flex justify-between items-center">
        <DaySelection date={date} onChange={onDateChange} />
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
                      handleTaskStatusChange(task.id, isDone)
                    }
                  >
                    {!task.doneDate && <ModifyTaskButton data={task} />}
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
