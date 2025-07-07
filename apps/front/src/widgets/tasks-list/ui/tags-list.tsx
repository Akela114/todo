import { TagItem, TagItemSkeleton, useTags } from "@/entities/tag";
import { formatDate } from "@/shared/common-helpers-and-constants";
import { Match } from "@/shared/ui";
import { useMemo } from "react";

interface TagListProps {
  date: Date;
  activeTagIds?: number[];
  onActiveTagIdsChange: (tagIds: number[]) => void;
}

export const TagsList = ({
  date,
  activeTagIds,
  onActiveTagIdsChange,
}: TagListProps) => {
  const { data: tags, status } = useTags(
    {
      activeTagIds,
      startFrom: formatDate(date),
    },
    true,
  );

  const coreTags = useMemo(
    () =>
      tags
        ?.map((tag) => ({
          ...tag,
          isActive: activeTagIds?.includes(tag.id) ?? false,
        }))
        .filter((tag) => tag.isActive || tag.tasksCount > 0)
        .sort((a, b) => {
          const aActivityValue = a.isActive ? 1 : 0;
          const bActivityValue = b.isActive ? 1 : 0;
          const activityDiff = bActivityValue - aActivityValue;

          if (activityDiff !== 0) {
            return activityDiff;
          }

          return b.tasksCount - a.tasksCount;
        }),
    [activeTagIds, tags],
  );

  const handleTagClick = (tagId: number) => {
    if (activeTagIds?.includes(tagId)) {
      onActiveTagIdsChange(activeTagIds.filter((id) => id !== tagId));
    } else {
      onActiveTagIdsChange([...(activeTagIds ?? []), tagId]);
    }
  };

  return (
    <div className="flex gap-1 flex-wrap">
      <Match
        value={status}
        success={() =>
          coreTags?.map((tag) => (
            <TagItem
              key={tag.id}
              data={tag}
              onClick={() => handleTagClick(tag.id)}
            />
          ))
        }
        pending={() =>
          Array.from({ length: 3 }).map((_, i) => <TagItemSkeleton key={i} />)
        }
      />
    </div>
  );
};
