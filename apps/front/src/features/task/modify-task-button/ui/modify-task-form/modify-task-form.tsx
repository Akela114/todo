import { TASK_PRIORITIES_OPTIONS, useModifyTask } from "@/entities/task";
import { getInputValidation, useDefaultForm } from "@/shared/forms";
import { Input, Select } from "@/shared/ui";
import { type Task, modifyTaskSchema } from "@packages/schemas/task";
import { Controller, FormProvider } from "react-hook-form";
import { TaskIntervalDatesInputs } from "./task-interval-dates-inputs";
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

  const { form, getFormComponent } = useDefaultForm({
    schema: modifyTaskSchema,
    useFormProps: {
      defaultValues: {
        title: data.title,
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    },
    onResetSubmit: resetSubmit,
    onSubmit: (submittedData) =>
      modifyEntry({ urlParams: data.id, body: submittedData }),
    submitButtonTitle: "Изменить задачу",
    submitError,
  });

  const { register, control, formState } = form;

  return getFormComponent(
    <FormProvider {...form}>
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
      </div>
      <TaskIntervalDatesInputs />
    </FormProvider>,
  );
};
