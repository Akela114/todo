import { Modal } from "@/shared/ui";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { CreateTaskFromInboxEntryForm } from "./create-task-from-inbox-entry-form";
import type { InboxEntry } from "@packages/schemas/inbox-entry";

interface CreateTaskFromInboxEntryButtonProps {
  data: InboxEntry;
}

export const CreateTaskFromInboxEntryButton = ({
  data,
}: CreateTaskFromInboxEntryButtonProps) => {
  return (
    <Modal
      title="Преобразовать в задачу"
      triggerModalButton={
        <button
          type="button"
          className="btn btn-primary btn-sm max-md:btn-square"
        >
          <MagicWandIcon />
          <span className="hidden md:inline">Преобразовать в задачу</span>
        </button>
      }
    >
      <CreateTaskFromInboxEntryForm inboxEntry={data} />
    </Modal>
  );
};
