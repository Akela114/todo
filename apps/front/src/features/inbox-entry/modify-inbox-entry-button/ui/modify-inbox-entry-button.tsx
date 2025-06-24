import type { InboxEntry } from "@packages/schemas/inbox-entry";
import { Modal } from "@/shared/ui";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ModifyInboxEntryForm } from "./modify-inbox-entry-form";
import { useRef } from "react";

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
