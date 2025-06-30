import { TASK_PRIORITIES_OPTIONS } from "@/entities/task";
import { formatTodayDate } from "@/shared/common-helpers-and-constants";
import { getInputValidation, useDefaultForm } from "@/shared/forms";
import { Input, Select } from "@/shared/ui";
import {
  type CreateOrModifyTask,
  type Task,
  createOrModifyTaskSchema,
} from "@packages/schemas/task";
import { Controller, FormProvider } from "react-hook-form";
import { TaskIntervalDatesInputs } from "./task-interval-dates-inputs";
import { TaskRepetitionInputs } from "./task-repetition-inputs";

interface ModifyTaskFormProps {
  data?: Partial<Task>;
  onSubmit: (data: CreateOrModifyTask) => void;
  submitError: {
    message: string;
    statusCode: number;
  } | null;
  resetSubmit: () => void;
}

export const CreateOrModifyTaskForm = ({
  data,
  onSubmit,
  submitError,
  resetSubmit,
}: ModifyTaskFormProps) => {
  const { form, getFormComponent } = useDefaultForm({
    schema: createOrModifyTaskSchema,
    useFormProps: {
      defaultValues: {
        title: data?.title,
        priority: data?.priority ?? Number(TASK_PRIORITIES_OPTIONS[1].value),
        startDate: data?.startDate ?? formatTodayDate(),
        endDate: data?.endDate ?? null,
        repetitionRule: data?.repetitionRule ?? null,
      },
    },
    onResetSubmit: resetSubmit,
    onSubmit,
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
      <TaskRepetitionInputs />
    </FormProvider>,
  );
};
