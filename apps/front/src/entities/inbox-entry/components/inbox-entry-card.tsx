import { formatDate } from "@/shared/common-helpers";
import { TextSkeleton } from "@/shared/ui";
import type { InboxEntry } from "@packages/schemas/inbox-entry";
import type { ReactNode } from "react";

interface InboxEntryCardProps {
  data: InboxEntry;
  children?: ReactNode;
}

export const InboxEntryCard = ({ data, children }: InboxEntryCardProps) => {
  return (
    <div className="flex items-center p-4">
      <div className="flex-1">
        <div className="text-xs tabular-nums">
          {formatDate(data.updatedAt, "timeDate")}
        </div>
        <div className="text-lg font-semibold">{data.title}</div>
      </div>
      {children && <div className="card-actions justify-end">{children}</div>}
    </div>
  );
};

export const InboxEntryCardSkeleton = () => {
  return (
    <div className="flex items-center p-4">
      <div className="flex-1">
        <TextSkeleton size="xs" />
        <TextSkeleton size="lg" />
      </div>
    </div>
  );
};
