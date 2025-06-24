import type { InboxEntry } from "@packages/schemas/inbox-entry";
import {
  useCreateTaskFromInboxEntry,
  TASK_PRIORITIES_OPTIONS,
} from "@/entities/task";
import { Input, Select } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  createTaskFromInboxEntrySchema,
  type CreateTaskFromInboxEntry,
} from "@packages/schemas/task";

interface CreateTaskFromInboxEntryFormProps {
  inboxEntry: InboxEntry;
  beforeSubmit?: (data: CreateTaskFromInboxEntry) => void;
  afterSubmit?: () => void;
}
export const CreateTaskFromInboxEntryForm = ({
  inboxEntry,
  beforeSubmit,
}: CreateTaskFromInboxEntryFormProps) => {
  const { mutateAsync: createTask, isPending } = useCreateTaskFromInboxEntry();

  const { handleSubmit, register, control, reset } = useForm({
    defaultValues: {
      title: inboxEntry.title,
      priority: 1,
    },
    resolver: zodResolver(createTaskFromInboxEntrySchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        beforeSubmit?.(data);
        await createTask({
          urlParams: inboxEntry.id,
          body: data,
        });
        reset();
      })}
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
        Создать задачу
      </button>
    </form>
  );
};
