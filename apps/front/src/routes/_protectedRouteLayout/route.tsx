import { checkAuth } from "@/entities/auth";
import { LogoutButton } from "@/features/auth";
import { queryClient } from "@/shared/query/query-client";
import { QUERY_KEYS } from "@/shared/query/query-keys";
import { LoadingScreen } from "@/shared/ui/loading-wrapper";
import { Header } from "@/widgets/common";
import { Navigation } from "@/widgets/common/navigation";
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_protectedRouteLayout")({
  component: ProtectedRouteLayout,
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
      throw redirect({ to: "/auth/login" });
    }
  },
});

function ProtectedRouteLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col">
      <Header
        innerClassName="w-full max-w-5xl mx-auto"
        actions={
          <LogoutButton onSuccess={() => navigate({ to: "/auth/login" })} />
        }
      />
      <main className="flex-1 px-2 py-6 w-full max-w-5xl self-center flex gap-4">
        <Navigation />
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
