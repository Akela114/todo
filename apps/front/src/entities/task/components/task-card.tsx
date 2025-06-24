import { format } from "date-fns";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { Task } from "@packages/schemas/task";
import { TextSkeleton } from "@/shared/ui/text-skeleton";
import { Rating } from "@/shared/ui/rating";

interface TaskCardProps {
  data: Task;
  onStatusChange?: (isDone: boolean) => void;
  children?: ReactNode;
}

export const TaskCard = ({ data, children, onStatusChange }: TaskCardProps) => {
  return (
    <div className="flex items-center p-4">
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
          <div className="flex items-center gap-2">
            <div className="text-xs tabular-nums">
              {format(data.updatedAt, "yyyy-MM-dd HH:mm")}
            </div>
            <Rating total={3} selected={data.priority + 1} />
          </div>
          <div className="text-lg font-semibold">{data.title}</div>
        </div>
      </div>
      {children && <div className="card-actions justify-end">{children}</div>}
    </div>
  );
};

export const TaskCardSkeleton = () => {
  return (
    <div className="flex items-center p-4">
      <div className="flex-1 flex items-center gap-4">
        <div className="skeleton h-6 w-6" />
        <div className="flex-1">
          <TextSkeleton size="xs" />
          <TextSkeleton size="lg" />
        </div>
      </div>
    </div>
  );
};
