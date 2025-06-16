import { Modal } from "@/shared/ui/dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { CreateInboxEntryForm } from "./create-inbox-entry-form";

export const CreateInboxEntryButton = () => {
  return (
    <Modal
      title="Добавление записи"
      renderModalButton={(openModal) => (
        <button
          type="button"
          className="btn btn-primary self-start"
          onClick={openModal}
        >
          <PlusIcon />
          Добавить
        </button>
      )}
    >
      <CreateInboxEntryForm />
    </Modal>
  );
};
