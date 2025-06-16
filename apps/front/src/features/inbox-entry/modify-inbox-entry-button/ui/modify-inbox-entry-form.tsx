import { useModifyInboxEntry } from "@/entities/inbox-entry";
import {
  type InboxEntry,
  createOrModifyInboxEntrySchema,
} from "@/entities/inbox-entry/model";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface ModifyInboxEntryFormProps {
  data: InboxEntry;
  onSuccess?: () => void;
}

export const ModifyInboxEntryForm = ({
  data,
  onSuccess,
}: ModifyInboxEntryFormProps) => {
  const { mutate: modifyEntry, isPending } = useModifyInboxEntry({
    onSuccess,
  });

  const { handleSubmit, register } = useForm({
    defaultValues: {
      title: data.title,
    },
    resolver: zodResolver(createOrModifyInboxEntrySchema),
  });

  return (
    <form
      onSubmit={handleSubmit((formData) =>
        modifyEntry({
          body: formData,
          urlParams: data.id,
        }),
      )}
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
        Изменить запись
      </button>
    </form>
  );
};
