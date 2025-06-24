import { modifyTaskSchema, type Task } from "@packages/schemas/task";
import { Input, Select } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useModifyTask, TASK_PRIORITIES_OPTIONS } from "@/entities/task";
interface ModifyTaskFormProps {
  data: Task;
  onSuccess?: () => void;
}

export const ModifyTaskForm = ({ data, onSuccess }: ModifyTaskFormProps) => {
  const { mutate: modifyEntry, isPending } = useModifyTask({
    onSuccess,
  });

  const { handleSubmit, control, register } = useForm({
    defaultValues: {
      title: data.title,
      priority: data.priority,
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
      <Controller
        control={control}
        name="priority"
        render={({ field: { value, onChange, ...field } }) => (
          <Select
            {...field}
            value={String(value)}
            onChange={(value) => onChange(Number(value))}
            placeholder="Выберите приоритет задачи..."
            label="Приоритет"
            options={TASK_PRIORITIES_OPTIONS}
          />
        )}
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
