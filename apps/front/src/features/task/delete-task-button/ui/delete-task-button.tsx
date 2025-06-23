import type { InboxEntry } from "@packages/schemas/inbox-entry";
import { useDeleteTask } from "@/entities/task";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DeleteTaskButtonProps {
  data: InboxEntry;
}

export const DeleteTaskButton = ({ data }: DeleteTaskButtonProps) => {
  const { mutate: deleteTask, status } = useDeleteTask();

  return (
    <button
      type="button"
      className="btn btn-soft btn-square btn-sm"
      onClick={() => deleteTask({ urlParams: data.id })}
      disabled={["pending", "success"].includes(status)}
    >
      <Cross2Icon />
    </button>
  );
};
