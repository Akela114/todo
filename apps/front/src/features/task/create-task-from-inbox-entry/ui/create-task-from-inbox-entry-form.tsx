import { useCreateTaskFromInboxEntry } from "@/entities/task";
import { CreateOrModifyTaskForm } from "@/entities/task/ui/create-or-modify-task-form";
import type { InboxEntry } from "@packages/schemas/inbox-entry";
import type { CreateOrModifyTask } from "@packages/schemas/task";

interface CreateTaskFromInboxEntryFormProps {
  inboxEntry: InboxEntry;
  beforeSubmit?: (data: CreateOrModifyTask) => void;
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

  return (
    <CreateOrModifyTaskForm
      onSubmit={(submitData) => {
        beforeSubmit?.(submitData);
        createTask({ urlParams: inboxEntry.id, body: submitData });
      }}
      data={inboxEntry}
      submitError={submitError}
      resetSubmit={resetSubmit}
    />
  );
};
