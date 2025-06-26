import { TODAY_AS_STRING, formatDate } from "@/shared/common-helpers";
import { TasksList } from "@/widgets/tasks-list";
import { Link, createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const tasksPageSearchSchema = z.object({
  page: fallback(z.coerce.number().min(1), 1),
  date: fallback(
    z.string().date().optional().default(TODAY_AS_STRING),
    TODAY_AS_STRING,
  ),
});

export const Route = createFileRoute("/_protectedRouteLayout/tasks")({
  component: TasksPage,
  validateSearch: zodValidator(tasksPageSearchSchema),
});

function TasksPage() {
  const { page, date } = Route.useSearch();
  const navigate = Route.useNavigate();

  const renderPageLink = (page: number, className?: string) => (
    <Link to="/tasks" search={{ page }} className={className}>
      {page}
    </Link>
  );

  return (
    <TasksList
      page={page}
      date={new Date(date)}
      pageSize={8}
      onPageChange={(page) => navigate({ search: { page, date } })}
      onDateChange={(date) =>
        navigate({
          search: { page, date: date ? formatDate(date) : TODAY_AS_STRING },
        })
      }
      renderPageLink={renderPageLink}
    />
  );
}
