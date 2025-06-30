import { formatDate } from "@/shared/common-helpers-and-constants";
import { Rating, TextSkeleton } from "@/shared/ui";
import type { Task } from "@packages/schemas/task";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { RemainingTime } from "./remaining-time";
import { Repetition } from "./repetition";

interface TaskCardProps {
  data: Task;
  onStatusChange?: (isDone: boolean) => void;
  children?: ReactNode;
}

export const TaskCard = ({ data, children, onStatusChange }: TaskCardProps) => {
  const isTaskDone = Boolean(data.doneDate);

  return (
    <div className="p-4">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2">
        <div className="flex-1 grid grid-cols-subgrid col-span-2 items-center">
          <input
            type="checkbox"
            className="checkbox"
            checked={Boolean(isTaskDone)}
            onChange={() => onStatusChange?.(!isTaskDone)}
          />
          <div className={twMerge("flex-1", isTaskDone && "opacity-50")}>
            <div className="flex items-center gap-2">
              <div className="text-xs tabular-nums">
                {formatDate(data.updatedAt, "timeDate")}
              </div>
              <Rating total={3} selected={data.priority + 1} />
            </div>
            <div
              className={twMerge(
                "text-lg font-semibold",
                isTaskDone && "line-through",
              )}
            >
              {data.title}
            </div>
          </div>
        </div>
        {children && <div className="card-actions justify-end">{children}</div>}
        <div className="col-start-2 col-span-2 text-xs flex flex-col gap-2">
          {data.repetitionRule && (
            <Repetition repetitionRule={data.repetitionRule} />
          )}
          {!isTaskDone && <RemainingTime endDate={data.endDate} />}
        </div>
      </div>
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
