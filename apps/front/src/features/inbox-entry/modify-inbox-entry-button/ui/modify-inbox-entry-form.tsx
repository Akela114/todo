import { useModifyInboxEntry } from "@/entities/inbox-entry";
import {
  type InboxEntry,
  createOrModifyInboxEntrySchema,
} from "@packages/schemas/inbox-entry";
import { Input } from "@/shared/ui";
import { getInputValidation, useDefaultForm } from "@/shared/forms";

interface ModifyInboxEntryFormProps {
  data: InboxEntry;
  onSuccess?: () => void;
}

export const ModifyInboxEntryForm = ({
  data,
  onSuccess,
}: ModifyInboxEntryFormProps) => {
  const {
    mutate: modifyEntry,
    error: submitError,
    reset: resetSubmit,
  } = useModifyInboxEntry({
    onSuccess,
  });

  const {
    form: { register, formState },
    getFormComponent,
  } = useDefaultForm({
    schema: createOrModifyInboxEntrySchema,
    useFormProps: {},
    onResetSubmit: resetSubmit,
    onSubmit: (submitData) =>
      modifyEntry({ urlParams: data.id, body: submitData }),
    submitButtonTitle: "Войти",
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
