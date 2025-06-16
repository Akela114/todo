import { format } from "date-fns";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { InboxEntry } from "../model";

interface InboxEntryCardProps {
  data: InboxEntry;
  children?: ReactNode;
  className?: string;
}

export const InboxEntryCard = ({
  data,
  className,
  children,
}: InboxEntryCardProps) => {
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
