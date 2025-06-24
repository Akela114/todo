import { modifyTaskSchema, type Task } from "@packages/schemas/task";
import { Input, Select } from "@/shared/ui";
import { Controller } from "react-hook-form";
import { useModifyTask, TASK_PRIORITIES_OPTIONS } from "@/entities/task";
import { getInputValidation, useDefaultForm } from "@/shared/forms";
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

  const {
    form: { register, control, formState },
    getFormComponent,
  } = useDefaultForm({
    schema: modifyTaskSchema,
    useFormProps: {
      defaultValues: {
        title: data.title,
        priority: data.priority,
      },
    },
    onResetSubmit: resetSubmit,
    onSubmit: (submittedData) =>
      modifyEntry({ urlParams: data.id, body: submittedData }),
    submitButtonTitle: "Изменить задачу",
    submitError,
  });

  return getFormComponent(
    <div className="flex flex-col gap-3">
      <Input
        {...register("title")}
        label="Заголовок"
        placeholder="Введите заголовок задачи..."
        inputValidation={getInputValidation(formState, "title")}
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
            inputValidation={getInputValidation(formState, "priority")}
          />
        )}
      />
    </div>,
  );
};
