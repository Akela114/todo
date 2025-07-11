import { CreateInboxEntryButton } from "@/features/inbox-entry";
import { InboxEntriesList } from "@/widgets/inbox-entry";
import { Link, createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const inboxEntriesPageSearchSchema = z.object({
  page: fallback(z.coerce.number().min(1), 1),
});

export const Route = createFileRoute("/_protectedRouteLayout/inbox")({
  component: InboxEntries,
  validateSearch: zodValidator(inboxEntriesPageSearchSchema),
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
      pageSize={6}
      renderPageLink={renderPageLink}
      onPageChange={(page) => navigate({ search: { page } })}
    >
      <CreateInboxEntryButton />
    </InboxEntriesList>
  );
}
