import { CreateInboxEntryButton } from "@/features/inbox-entry";
import { InboxEntriesList } from "@/widgets/inbox-entry";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protectedRouteLayout/")({
  component: MainPage,
});

function MainPage() {
  return (
    <InboxEntriesList className="max-w-5xl mx-auto">
      <CreateInboxEntryButton />
    </InboxEntriesList>
  );
}
