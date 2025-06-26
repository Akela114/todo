import { TasksList } from "@/widgets/tasks-list";
import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const tasksPageSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
});

export const Route = createFileRoute("/_protectedRouteLayout/tasks")({
  component: TasksPage,
  validateSearch: (search) => tasksPageSearchSchema.parse(search),
});

function TasksPage() {
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();

  const renderPageLink = (page: number, className?: string) => (
    <Link to="/tasks" search={{ page }} className={className}>
      {page}
    </Link>
  );

  return (
    <TasksList
      page={page}
      pageSize={8}
      onPageChange={(page) => navigate({ search: { page } })}
      renderPageLink={renderPageLink}
    />
  );
}
