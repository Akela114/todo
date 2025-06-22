import { CreateInboxEntryButton } from "@/features/inbox-entry";
import { InboxEntriesList } from "@/widgets/inbox-entry";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protectedRouteLayout/inbox")({
  component: MainPage,
});

function MainPage() {
  return (
    <InboxEntriesList>
      <CreateInboxEntryButton />
    </InboxEntriesList>
  );
}
