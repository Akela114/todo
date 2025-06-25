import { CreateInboxEntryButton } from "@/features/inbox-entry";
import { InboxEntriesList } from "@/widgets/inbox-entry";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

const inboxEntriesPageSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
});

export const Route = createFileRoute("/_protectedRouteLayout/inbox")({
  component: InboxEntries,
  validateSearch: (search) => inboxEntriesPageSearchSchema.parse(search),
});

function InboxEntries() {
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();

  const renderPageLink = (page: number, className?: string) => (
    <Link to="/inbox" search={{ page }} className={className}>
      {page}
    </Link>
  );

  return (
    <InboxEntriesList
      page={page}
      pageSize={8}
      renderPageLink={renderPageLink}
      onPageChange={(page) => navigate({ search: { page } })}
    >
      <CreateInboxEntryButton />
    </InboxEntriesList>
  );
}
