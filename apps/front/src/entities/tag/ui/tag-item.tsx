import { TextSkeleton } from "@/shared/ui";
import type { Tag } from "@packages/schemas/tag";
import type { ComponentRef, Ref } from "react";
import { twMerge } from "tailwind-merge";

interface TagItemProps {
  data: Tag & {
    isActive: boolean;
  };
  onClick: () => void;
  ref?: Ref<ComponentRef<"button">>;
}

export const TagItem = ({ data, onClick, ref }: TagItemProps) => {
  return (
    <button
      ref={ref}
      type="button"
      className={twMerge(
        "badge badge-soft flex items-center gap-2 justify-between not-disabled:cursor-pointer",
        data.isActive && "badge-primary",
      )}
      onClick={onClick}
      disabled={!data.tasksCount}
    >
      <div className="flex-1 flex items-center gap-4 justify-between leading-none">
        {data.name} ({data.tasksCount})
      </div>
    </button>
  );
};

export const TagItemSkeleton = () => {
  return (
    <div className="badge badge-soft">
      <TextSkeleton size="xs" />
    </div>
  );
};
