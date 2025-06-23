import { useDeleteInboxEntry } from "@/entities/inbox-entry";
import type { InboxEntry } from "@packages/schemas/inbox-entry";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DeleteInboxEntryButtonProps {
  data: InboxEntry;
}

export const DeleteInboxEntryButton = ({
  data,
}: DeleteInboxEntryButtonProps) => {
  const { mutate: deleteTodo, status } = useDeleteInboxEntry();

  return (
    <button
      type="button"
      className="btn btn-soft btn-square btn-sm"
      onClick={() => deleteTodo({ urlParams: data.id })}
      disabled={["pending", "success"].includes(status)}
    >
      <Cross2Icon />
    </button>
  );
};
