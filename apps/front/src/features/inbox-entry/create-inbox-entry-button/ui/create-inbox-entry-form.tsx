import { useCreateInboxEntry } from "@/entities/inbox-entry";
import {
  type CreateOrModifyInboxEntry,
  createOrModifyInboxEntrySchema,
} from "@packages/schemas/inbox-entry";
import { Input } from "@/shared/ui";
import { getInputValidation, useDefaultForm } from "@/shared/forms";

interface CreateInboxEntryFormProps {
  beforeSubmit?: (data: CreateOrModifyInboxEntry) => void;
  afterSubmit?: () => void;
}

export const CreateInboxEntryForm = ({
  beforeSubmit,
}: CreateInboxEntryFormProps) => {
  const {
    mutateAsync: createEntry,
    error: submitError,
    reset: resetSubmit,
  } = useCreateInboxEntry();

  const {
    form: { register, formState },
    getFormComponent,
  } = useDefaultForm({
    schema: createOrModifyInboxEntrySchema,
    useFormProps: {},
    beforeSubmit,
    onResetSubmit: resetSubmit,
    onSubmit: (data) => createEntry({ body: data }),
    submitButtonTitle: "Создать запись",
    submitError,
  });

  return getFormComponent(
    <Input
      {...register("title")}
      label="Сообщение"
      placeholder="Введите сообщение..."
      inputValidation={getInputValidation(formState, "title")}
    />,
  );
};
