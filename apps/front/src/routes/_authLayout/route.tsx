import { checkAuth } from "@/entities/auth";
import { QUERY_KEYS, queryClient } from "@/shared/query";
import { LoadingScreen } from "@/shared/ui";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authLayout")({
  component: AuthLayout,
  pendingComponent: LoadingScreen,
  pendingMinMs: 300,
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery({
        queryKey: [QUERY_KEYS.authCheck],
        queryFn: checkAuth,
        staleTime: Number.POSITIVE_INFINITY,
      });
    } catch {
      return;
    }
    throw redirect({ to: "/inbox", search: { page: 1 } });
  },
});

function AuthLayout() {
  return (
    <div className="flex items-center justify-center flex-1 px-2 py-6">
      <Outlet />
    </div>
  );
}
