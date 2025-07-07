import {
  CreateOrModifyTaskForm,
  useCreateTaskFromInboxEntry,
} from "@/entities/task";
import type { InboxEntry } from "@packages/schemas/inbox-entry";
import type { CreateOrModifyTaskFrontSubmit } from "@packages/schemas/task";

interface CreateTaskFromInboxEntryFormProps {
  inboxEntry: InboxEntry;
  beforeSubmit?: (data: CreateOrModifyTaskFrontSubmit) => void;
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
