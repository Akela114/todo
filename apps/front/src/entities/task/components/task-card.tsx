import { format } from "date-fns";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { Task } from "../model";
import { SimpleListItem } from "@/shared/ui/simple-list";
import { TextSkeleton } from "@/shared/ui/text-skeleton";

interface TaskCardProps {
  data: Task;
  onStatusChange?: (isDone: boolean) => void;
  children?: ReactNode;
}

export const TaskCard = ({ data, children, onStatusChange }: TaskCardProps) => {
  return (
    <SimpleListItem className="flex items-center p-4">
      <div className="flex-1 flex items-center gap-4">
        <input
          type="checkbox"
          className="checkbox"
          checked={data.done}
          onChange={() => onStatusChange?.(!data.done)}
        />
        <div
          className={twMerge("flex-1", data.done && "line-through opacity-50")}
        >
          <div className="text-xs">
            {format(data.updatedAt, "yyyy-MM-dd HH:mm")}
          </div>
          <div className="text-lg font-semibold">{data.title}</div>
        </div>
      </div>
      {children && <div className="card-actions justify-end">{children}</div>}
    </SimpleListItem>
  );
};

export const TaskCardSkeleton = () => {
  return (
    <SimpleListItem className="flex items-center p-4">
      <div className="flex-1 flex items-center gap-4">
        <div className="skeleton h-6 w-6" />
        <div className="flex-1">
          <TextSkeleton size="xs" />
          <TextSkeleton size="lg" />
        </div>
      </div>
    </SimpleListItem>
  );
};
