import { Modal } from "@/shared/ui";
import type { InboxEntry } from "@packages/schemas/inbox-entry";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { CreateTaskFromInboxEntryForm } from "./create-task-from-inbox-entry-form";

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
        <button type="button" className="btn btn-primary btn-sm btn-square">
          <MagicWandIcon />
        </button>
      }
    >
      <CreateTaskFromInboxEntryForm inboxEntry={data} />
    </Modal>
  );
};
