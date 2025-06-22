import type { InboxEntry } from "@/entities/inbox-entry";
import {
  type CreateOrModifyInboxEntry,
  createOrModifyInboxEntrySchema,
} from "@/entities/inbox-entry";
import { useCreateTaskFromInboxEntry } from "@/entities/task";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CreateTaskFromInboxEntryFormProps {
  inboxEntry: InboxEntry;
  beforeSubmit?: (data: CreateOrModifyInboxEntry) => void;
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
    resolver: zodResolver(createOrModifyInboxEntrySchema),
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
