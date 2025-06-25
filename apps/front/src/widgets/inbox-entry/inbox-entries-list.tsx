import {
  InboxEntryCard,
  InboxEntryCardSkeleton,
  useInboxEntries,
} from "@/entities/inbox-entry";
import {
  ModifyInboxEntryButton,
  DeleteInboxEntryButton,
} from "@/features/inbox-entry";
import { CreateTaskFromInboxEntryButton } from "@/features/task";
import { useThrottledValue } from "@/shared/common-hooks";
import {
  FetchEmpty,
  FetchError,
  Match,
  SimpleList,
  SimpleListItem,
  Pagination,
  PaginationSkeleton,
} from "@/shared/ui";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface InboxEntriesListProps {
  page: number;
  pageSize: number;
  renderPageLink: (page: number, className?: string) => ReactNode;
  onPageChange: (page: number) => void;
  children?: ReactNode;
  className?: string;
}

export const InboxEntriesList = ({
  page,
  pageSize,
  onPageChange,
  renderPageLink,
  className,
  children,
}: InboxEntriesListProps) => {
  const {
    data: entries,
    status,
    refetch,
  } = useInboxEntries(
    {
      page,
      pageSize,
    },
    (entries) => {
      if (entries.pagination.page > 1 && !entries.data.length) {
        onPageChange(1);
      }
    },
  );
  const throttledStatus = useThrottledValue(status, 300);

  return (
    <div className={twMerge("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2 flex-1">{children}</div>
        <Match
          value={throttledStatus}
          success={() =>
            entries?.pagination ? (
              <Pagination
                page={entries.pagination.page}
                renderPaginationElement={renderPageLink}
                totalCount={entries.pagination.totalCount}
                pageSize={entries.pagination.pageSize}
              />
            ) : null
          }
          pending={() => <PaginationSkeleton />}
        />
      </div>
      <Match
        value={throttledStatus}
        success={() =>
          entries?.data.length ? (
            <SimpleList>
              {entries.data.map((entry) => (
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
            {Array.from({ length: pageSize }).map((_, idx) => (
              <SimpleListItem key={idx}>
                <InboxEntryCardSkeleton />
              </SimpleListItem>
            ))}
          </SimpleList>
        )}
      />
    </div>
  );
};
