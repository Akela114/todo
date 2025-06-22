import { queryClient } from "@/shared/query/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-base-300 flex flex-col">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </QueryClientProvider>
  ),
  notFoundComponent: () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="text-lg font-bold">Страница не найдена</div>
      <Link to="/tasks" className="btn btn-primary">
        К списку задач
      </Link>
    </div>
  ),
});
