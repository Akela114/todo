import { useCreateInboxEntry } from "@/entities/inbox-entry";
import { getInputValidation, useDefaultForm } from "@/shared/forms";
import { Input } from "@/shared/ui";
import {
  type CreateOrModifyInboxEntry,
  createOrModifyInboxEntrySchema,
} from "@packages/schemas/inbox-entry";

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
    withResetOnSubmit: true,
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
