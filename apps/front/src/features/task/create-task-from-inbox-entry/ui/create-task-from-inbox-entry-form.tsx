import {
  TASK_PRIORITIES_OPTIONS,
  useCreateTaskFromInboxEntry,
} from "@/entities/task";
import { getInputValidation, useDefaultForm } from "@/shared/forms";
import { Input, Select } from "@/shared/ui";
import type { InboxEntry } from "@packages/schemas/inbox-entry";
import {
  type CreateTaskFromInboxEntry,
  createTaskFromInboxEntrySchema,
} from "@packages/schemas/task";
import { Controller } from "react-hook-form";

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

  const {
    form: { register, control, formState },
    getFormComponent,
  } = useDefaultForm({
    schema: createTaskFromInboxEntrySchema,
    useFormProps: {
      defaultValues: {
        title: inboxEntry.title,
        priority: 1,
      },
    },
    onResetSubmit: resetSubmit,
    onSubmit: (data) => createTask({ urlParams: inboxEntry.id, body: data }),
    submitButtonTitle: "Создать задачу",
    beforeSubmit,
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
