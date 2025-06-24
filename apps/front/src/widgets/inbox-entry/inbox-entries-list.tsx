import {
  InboxEntryCard,
  InboxEntryCardSkeleton,
  useInboxEntries,
} from "@/entities/inbox-entry";
import {
  ModifyInboxEntryButton,
  DeleteInboxEntryButton,
} from "@/features/inbox-entry";
import { CreateTaskFromInboxEntryButton } from "@/features/task/create-task-from-inbox-entry";
import { useThrottledValue } from "@/shared/hooks/use-throttled-value";
import { FetchEmpty } from "@/shared/ui/fetch-empty";
import { FetchError } from "@/shared/ui/fetch-error";
import { Match } from "@/shared/ui/match";
import { SimpleList, SimpleListItem } from "@/shared/ui/simple-list";
import type { ReactNode } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

interface InboxEntriesListProps {
  children?: ReactNode;
  className?: string;
}

export const InboxEntriesList = ({
  className,
  children,
}: InboxEntriesListProps) => {
  const { data: entries, status, refetch } = useInboxEntries();
  const throttledStatus = useThrottledValue(status, 500);

  return (
    <div className={twMerge("flex flex-col gap-4", className)}>
      {children && <div className="flex gap-2">{children}</div>}
      <Match
        value={throttledStatus}
        success={() =>
          entries?.length ? (
            <SimpleList>
              {entries.map((entry) => (
                <SimpleListItem key={entry.id}>
                  <InboxEntryCard data={entry}>
                    <CreateTaskFromInboxEntryButton data={entry} />
                    <ModifyInboxEntryButton data={entry} />
                    <DeleteInboxEntryButton data={entry} />
                  </InboxEntryCard>
                </SimpleListItem>
              ))}
            </SimpleList>
          ) : (
            <FetchEmpty>Список входящих пуст</FetchEmpty>
          )
        }
        error={() => (
          <FetchError onRetry={() => refetch()}>
            Произошла ошибка при загрузке входящих!
          </FetchError>
        )}
        pending={() => (
          <SimpleList>
            {Array.from({ length: 3 }).map((_, index) => (
              <SimpleListItem key={index}>
                <InboxEntryCardSkeleton />
              </SimpleListItem>
            ))}
          </SimpleList>
        )}
      />
    </div>
  );
};
