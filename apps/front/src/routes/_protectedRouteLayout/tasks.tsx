import {
  formatDate,
  formatTodayDate,
} from "@/shared/common-helpers-and-constants";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "@/shared/local-storage/utils";
import { TasksList } from "@/widgets/tasks-list";
import { tagIdsSchema } from "@packages/schemas/tag";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useEffect } from "react";
import { z } from "zod";

const tasksPageSearchSchema = z.object({
  page: fallback(z.coerce.number().min(1), 1),
  date: fallback(
    z.string().date().optional().default(formatTodayDate()),
    formatTodayDate(),
  ),
  tagIds: fallback(tagIdsSchema.optional(), []),
});

export const Route = createFileRoute("/_protectedRouteLayout/tasks")({
  component: TasksPage,
  validateSearch: zodValidator(tasksPageSearchSchema),
  beforeLoad: async (ctx) => {
    const searchParams = ctx.search;
    if (!searchParams.tagIds) {
      const params = getLocalStorageData("taskPageParams", { tagIds: [] });
      throw redirect({ search: { ...params, ...ctx.search } });
    }
  },
});

function TasksPage() {
  const searchParams = Route.useSearch();
  const { page, date, tagIds } = searchParams;

  const navigate = Route.useNavigate();

  useEffect(() => {
    setLocalStorageData("taskPageParams", { tagIds });
  }, [tagIds]);

  const renderPageLink = (page: number, className?: string) => (
    <Link to="/tasks" search={{ page, date }} className={className}>
      {page}
    </Link>
  );

  return (
    <TasksList
      page={page}
      date={new Date(date)}
      pageSize={6}
      tagIds={tagIds}
      onPageChange={(page) => navigate({ search: { ...searchParams, page } })}
      onDateChange={(date) =>
        navigate({
          search: { ...searchParams, date: date && formatDate(date) },
        })
      }
      onTagIdsChange={(tagIds) =>
        navigate({ search: { ...searchParams, tagIds } })
      }
      renderPageLink={renderPageLink}
    />
  );
}
