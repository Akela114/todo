import { useDeleteInboxEntry } from "@/entities/inbox-entry";
import type { InboxEntry } from "@/entities/inbox-entry";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DeleteInboxEntryButtonProps {
  data: InboxEntry;
}

export const DeleteInboxEntryButton = ({
  data,
}: DeleteInboxEntryButtonProps) => {
  const { mutate: deleteTodo } = useDeleteInboxEntry();

  return (
    <button
      type="button"
      className="btn btn-soft btn-square btn-sm"
      onClick={() => deleteTodo({ urlParams: data.id })}
    >
      <Cross2Icon />
    </button>
  );
};
