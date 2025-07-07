import { useCreateTag } from "@/entities/tag";
import type { Tag } from "@packages/schemas/tag";
import { PlusIcon } from "@radix-ui/react-icons";

interface CreateTagButtonProps {
  name: string;
  onCreate?: (data: Tag) => void;
}

export const CreateTagButton = ({ name, onCreate }: CreateTagButtonProps) => {
  const { mutate: createTag, status } = useCreateTag({
    onSuccess: onCreate,
  });

  return (
    <button
      type="button"
      className="px-4 py-2 hover:bg-base-300 w-full flex items-center gap-2 transition-colors"
      onClick={() => createTag({ body: { name } })}
      disabled={status === "pending"}
    >
      {status === "pending" ? (
        <span className="loading loading-spinner loading-xs" />
      ) : (
        <PlusIcon className="size-4" />
      )}
      Создать тэг "{name}"
    </button>
  );
};
