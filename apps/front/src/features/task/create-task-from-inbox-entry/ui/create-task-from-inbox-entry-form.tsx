import type { InboxEntry } from "@packages/schemas/inbox-entry";
import { useCreateTaskFromInboxEntry } from "@/entities/task";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      title: inboxEntry.title,
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
