import { Modal } from "@/shared/ui";
import type { InboxEntry } from "@packages/schemas/inbox-entry";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useRef } from "react";
import { ModifyInboxEntryForm } from "./modify-inbox-entry-form";

interface ModifyInboxEntryButtonProps {
  data: InboxEntry;
}

export const ModifyInboxEntryButton = ({
  data,
}: ModifyInboxEntryButtonProps) => {
  const modalRef = useRef<{ close: () => void }>(null);

  return (
    <Modal
      ref={modalRef}
      title="Изменение записи"
      triggerModalButton={
        <button type="button" className="btn btn-soft btn-square btn-sm">
          <Pencil1Icon />
        </button>
      }
    >
      <ModifyInboxEntryForm
        data={data}
        onSuccess={() => modalRef.current?.close()}
      />
    </Modal>
  );
};
