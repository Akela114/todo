import { useModifyTask } from "@/entities/task";
import { CreateOrModifyTaskForm } from "@/entities/task/ui/create-or-modify-task-form";
import type { Task } from "@packages/schemas/task";

interface ModifyTaskFormProps {
  data: Task;
  onSuccess?: () => void;
}

export const ModifyTaskForm = ({ data, onSuccess }: ModifyTaskFormProps) => {
  const {
    mutate: modifyEntry,
    error: submitError,
    reset: resetSubmit,
  } = useModifyTask({
    onSuccess,
  });

  return (
    <CreateOrModifyTaskForm
      onSubmit={(submitData) =>
        modifyEntry({ urlParams: data.id, body: submitData })
      }
      data={data}
      submitError={submitError}
      resetSubmit={resetSubmit}
    />
  );
};
