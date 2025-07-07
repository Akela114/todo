import { useTags } from "@/entities/tag";
import type { getInputValidation } from "@/shared/forms";
import { Multiselect } from "@/shared/ui";
import type { Tag } from "@packages/schemas/tag";
import { type ComponentRef, type Ref, useMemo, useRef, useState } from "react";
import { CreateTagButton } from "../../create-tag";

interface TagsSelectProps {
  label: string;
  selectedTags: {
    value: number;
    label: string;
  }[];
  onChange: (tags: { value: number; label: string }[]) => void;
  ref: Ref<ComponentRef<typeof Multiselect>>;
  inputValidation?: ReturnType<typeof getInputValidation>;
  placeholder?: string;
}

export const TagsSelect = ({
  label,
  selectedTags,
  onChange,
  ref,
  inputValidation,
  placeholder,
}: TagsSelectProps) => {
  const inputRef = useRef<ComponentRef<"input">>(null);
  const [query, setQuery] = useState("");
  const { data } = useTags({ query }, true);

  const options = useMemo(() => {
    if (!data) return [];

    return [
      ...data
        .filter((tag) => !selectedTags.find((t) => t.value === tag.id))
        .map((tag) => ({
          value: tag.id,
          label: tag.name,
        })),
      ...selectedTags,
    ];
  }, [data, selectedTags]);

  const showCreateButtonn = query && !options.find((o) => o.label === query);

  const handleTagIdsChange = (tagIds: number[]) => {
    onChange(
      tagIds.map((id) => ({
        value: id,
        label:
          selectedTags.find((t) => t.value === id)?.label ??
          options.find((o) => o.value === id)?.label ??
          String(id),
      })),
    );
  };

  const handleTaskCreate = (tag: Tag) => {
    onChange([...selectedTags, { value: tag.id, label: tag.name }]);
    inputRef.current?.focus();
  };

  return (
    <Multiselect
      placeholder={placeholder}
      ref={ref}
      label={label}
      options={options}
      selectedValues={selectedTags.map((t) => t.value)}
      onChange={handleTagIdsChange}
      topElement={
        <input
          ref={inputRef}
          placeholder="Введите название тэга..."
          className="p-4 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      }
      bottomElement={
        showCreateButtonn && (
          <CreateTagButton name={query} onCreate={handleTaskCreate} />
        )
      }
      inputValidation={inputValidation}
    />
  );
};
