import { Modal } from "@/shared/ui";
import { PlusIcon } from "@radix-ui/react-icons";
import { CreateInboxEntryForm } from "./create-inbox-entry-form";

export const CreateInboxEntryButton = () => {
  return (
    <Modal
      title="Добавление записи"
      triggerModalButton={
        <button type="button" className="btn btn-primary self-start">
          <PlusIcon />
          Добавить
        </button>
      }
    >
      <CreateInboxEntryForm />
    </Modal>
  );
};
