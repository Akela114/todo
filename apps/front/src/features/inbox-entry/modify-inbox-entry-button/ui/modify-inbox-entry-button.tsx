import type { InboxEntry } from "@/entities/inbox-entry/model";
import { Modal } from "@/shared/ui/dialog";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ModifyInboxEntryForm } from "./modify-inbox-entry-form";

interface ModifyInboxEntryButtonProps {
  data: InboxEntry;
}

export const ModifyInboxEntryButton = ({
  data,
}: ModifyInboxEntryButtonProps) => {
  return (
    <Modal
      title="Изменение записи"
      renderModalButton={(openModal) => (
        <button
          type="button"
          className="btn btn-soft btn-square btn-sm"
          onClick={openModal}
        >
          <Pencil1Icon />
        </button>
      )}
    >
      <ModifyInboxEntryForm data={data} />
    </Modal>
  );
};
