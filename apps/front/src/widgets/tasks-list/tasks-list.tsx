import { TaskCard, useTasks } from "@/entities/task";
import { DeleteTaskButton, ModifyTaskButton } from "@/features/task";
import type { ReactNode } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

interface TasksListProps {
  children?: ReactNode;
  className?: string;
}

export const TasksList = ({ className, children }: TasksListProps) => {
  const { data: tasks } = useTasks();

  const taskElements = tasks?.map((task) => (
    <TaskCard data={task} className="list-row" key={task.id}>
      <ModifyTaskButton data={task} />
      <DeleteTaskButton data={task} />
    </TaskCard>
  ));

  return (
    <div className={twMerge("flex flex-col gap-4", className)}>
      {children && <div className="flex gap-2">{children}</div>}
      <ul className="list bg-base-100 rounded-box shadow-md">{taskElements}</ul>
    </div>
  );
};
