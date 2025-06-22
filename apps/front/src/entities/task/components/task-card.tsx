import { format } from "date-fns";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { Task } from "../model";

interface TaskCardProps {
  data: Task;
  children?: ReactNode;
  className?: string;
}

export const TaskCard = ({ data, className, children }: TaskCardProps) => {
  return (
    <div className={twMerge("flex items-center p-4", className)}>
      <div className="flex-1">
        <div className="text-xs">
          {format(data.updatedAt, "yyyy-MM-dd HH:mm")}
        </div>
        <div className="text-lg font-semibold">{data.title}</div>
      </div>
      {children && <div className="card-actions justify-end">{children}</div>}
    </div>
  );
};
