import { useCreateInboxEntry } from "@/entities/inbox-entry";
import {
  type CreateOrModifyInboxEntry,
  createOrModifyInboxEntrySchema,
} from "@packages/schemas/inbox-entry";
import { Input } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CreateInboxEntryFormProps {
  beforeSubmit?: (data: CreateOrModifyInboxEntry) => void;
  afterSubmit?: () => void;
}

export const CreateInboxEntryForm = ({
  beforeSubmit,
}: CreateInboxEntryFormProps) => {
  const { mutateAsync: createEntry, isPending } = useCreateInboxEntry();

  const { handleSubmit, register, reset } = useForm({
    resolver: zodResolver(createOrModifyInboxEntrySchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        beforeSubmit?.(data);
        await createEntry({
          body: data,
        });
        reset();
      })}
      className="flex flex-col gap-4"
    >
      <Input
        {...register("title")}
        label="Сообщение"
        placeholder="Введите сообщение..."
      />
      <button
        type="submit"
        className="btn btn-primary self-end"
        disabled={isPending}
      >
        Создать запись
      </button>
    </form>
  );
};
