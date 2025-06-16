import { InboxEntryCard, useInboxEntries } from "@/entities/inbox-entry";
import {
  ModifyInboxEntryButton,
  DeleteInboxEntryButton,
} from "@/features/inbox-entry";
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
  const { data: entries } = useInboxEntries();

  const entryElements = entries?.map((entry) => (
    <InboxEntryCard data={entry} className="list-row" key={entry.id}>
      <ModifyInboxEntryButton data={entry} />
      <DeleteInboxEntryButton data={entry} />
    </InboxEntryCard>
  ));

  return (
    <div className={twMerge("flex flex-col gap-4", className)}>
      {children && <div className="flex gap-2">{children}</div>}
      <ul className="list bg-base-100 rounded-box shadow-md">
        {entryElements}
      </ul>
    </div>
  );
};
