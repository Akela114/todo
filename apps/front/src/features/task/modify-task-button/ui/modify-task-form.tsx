import { modifyTaskSchema, type Task } from "@packages/schemas/task";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useModifyTask } from "@/entities/task";

interface ModifyTaskFormProps {
  data: Task;
  onSuccess?: () => void;
}

export const ModifyTaskForm = ({ data, onSuccess }: ModifyTaskFormProps) => {
  const { mutate: modifyEntry, isPending } = useModifyTask({
    onSuccess,
  });

  const { handleSubmit, register } = useForm({
    defaultValues: {
      title: data.title,
    },
    resolver: zodResolver(modifyTaskSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((formData) =>
        modifyEntry({
          body: formData,
          urlParams: data.id,
        }),
      )}
      className="flex flex-col gap-4"
    >
      <Input
        {...register("title")}
        label="Заголовок"
        placeholder="Введите заголовок задачи..."
      />
      <button
        type="submit"
        className="btn btn-primary self-end"
        disabled={isPending}
      >
        Изменить задачу
      </button>
    </form>
  );
};
