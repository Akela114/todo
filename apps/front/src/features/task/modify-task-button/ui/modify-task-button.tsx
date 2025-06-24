import type { Task } from "@packages/schemas/task";
import { Modal } from "@/shared/ui";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useRef } from "react";
import { ModifyTaskForm } from "./modify-task-form";

interface ModifyTaskButtonProps {
  data: Task;
}

export const ModifyTaskButton = ({ data }: ModifyTaskButtonProps) => {
  const modalRef = useRef<{ close: () => void }>(null);

  return (
    <Modal
      ref={modalRef}
      title="Изменение задачи"
      triggerModalButton={
        <button type="button" className="btn btn-soft btn-square btn-sm">
          <Pencil1Icon />
        </button>
      }
    >
      <ModifyTaskForm data={data} onSuccess={() => modalRef.current?.close()} />
    </Modal>
  );
};
