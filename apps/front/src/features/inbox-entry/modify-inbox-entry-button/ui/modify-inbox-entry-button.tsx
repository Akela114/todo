import type { InboxEntry } from "@/entities/inbox-entry/model";
import { Modal } from "@/shared/ui/dialog";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ModifyInboxEntryForm } from "./modify-inbox-entry-form";
import { useRef, type ComponentRef } from "react";

interface ModifyInboxEntryButtonProps {
  data: InboxEntry;
}

export const ModifyInboxEntryButton = ({
  data,
}: ModifyInboxEntryButtonProps) => {
  const dialogRef = useRef<ComponentRef<typeof Modal>>(null);

  return (
    <Modal
      ref={dialogRef}
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
      <ModifyInboxEntryForm
        data={data}
        onSuccess={() => dialogRef.current?.close()}
      />
    </Modal>
  );
};
