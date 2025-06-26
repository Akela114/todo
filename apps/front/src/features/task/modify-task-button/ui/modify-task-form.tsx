import { TASK_PRIORITIES_OPTIONS, useModifyTask } from "@/entities/task";
import { formatDate, formatTodayDate } from "@/shared/common-helpers";
import { getInputValidation, useDefaultForm } from "@/shared/forms";
import { DayInput, Input, Select } from "@/shared/ui";
import { type Task, modifyTaskSchema } from "@packages/schemas/task";
import { Controller } from "react-hook-form";
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
        startDate: data.startDate,
      },
    },
    onResetSubmit: resetSubmit,
    onSubmit: (submittedData) =>
      modifyEntry({ urlParams: data.id, body: submittedData }),
    submitButtonTitle: "Изменить задачу",
    submitError,
  });

  return getFormComponent(
    <div className="flex flex-col gap-4">
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
      <Controller
        control={control}
        name="startDate"
        render={({ field: { value, onChange, ...field } }) => (
          <DayInput
            {...field}
            value={value ? new Date(value) : undefined}
            onChange={(value) =>
              onChange(value ? formatDate(value) : formatTodayDate)
            }
            placeholder="Выберите дату начала..."
            label="Дата начала"
            inputValidation={getInputValidation(formState, "startDate")}
          />
        )}
      />
    </div>,
  );
};
