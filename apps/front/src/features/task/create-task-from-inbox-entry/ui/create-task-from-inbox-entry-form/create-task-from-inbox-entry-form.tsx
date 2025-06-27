import {
  TASK_PRIORITIES_OPTIONS,
  useCreateTaskFromInboxEntry,
} from "@/entities/task";
import { formatTodayDate } from "@/shared/common-helpers";
import { getInputValidation, useDefaultForm } from "@/shared/forms";
import { Input, Select } from "@/shared/ui";
import type { InboxEntry } from "@packages/schemas/inbox-entry";
import {
  type CreateTaskFromInboxEntry,
  createTaskFromInboxEntrySchema,
} from "@packages/schemas/task";
import { Controller, FormProvider } from "react-hook-form";
import { TaskIntervalDatesInputs } from "./task-interval-dates-inputs";

interface CreateTaskFromInboxEntryFormProps {
  inboxEntry: InboxEntry;
  beforeSubmit?: (data: CreateTaskFromInboxEntry) => void;
  afterSubmit?: () => void;
}
export const CreateTaskFromInboxEntryForm = ({
  inboxEntry,
  beforeSubmit,
}: CreateTaskFromInboxEntryFormProps) => {
  const {
    mutateAsync: createTask,
    error: submitError,
    reset: resetSubmit,
  } = useCreateTaskFromInboxEntry();

  const { form, getFormComponent } = useDefaultForm({
    schema: createTaskFromInboxEntrySchema,
    useFormProps: {
      defaultValues: {
        title: inboxEntry.title,
        priority: 1,
        startDate: formatTodayDate(),
        endDate: null,
      },
    },
    onResetSubmit: resetSubmit,
    onSubmit: (data) => createTask({ urlParams: inboxEntry.id, body: data }),
    submitButtonTitle: "Создать задачу",
    beforeSubmit,
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
        <TaskIntervalDatesInputs />
      </div>
    </FormProvider>,
  );
};
