import type { Task } from "@/entities/task";
import { Modal } from "@/shared/ui/dialog";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useRef, type ComponentRef } from "react";
import { ModifyTaskForm } from "./modify-task-form";

interface ModifyTaskButtonProps {
  data: Task;
}

export const ModifyTaskButton = ({ data }: ModifyTaskButtonProps) => {
  const dialogRef = useRef<ComponentRef<typeof Modal>>(null);

  return (
    <Modal
      ref={dialogRef}
      title="Изменение задачи"
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
      <ModifyTaskForm
        data={data}
        onSuccess={() => dialogRef.current?.close()}
      />
    </Modal>
  );
};
