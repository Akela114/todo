import { checkAuth } from "@/entities/auth";
import { LogoutButton } from "@/features/auth";
import { queryClient, QUERY_KEYS } from "@/shared/query";
import { ROUTE_LABELS } from "@/shared/router";
import { LoadingScreen } from "@/shared/ui";
import { Header, Navigation } from "@/widgets/common";
import {
  Outlet,
  createFileRoute,
  redirect,
  useLocation,
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
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const pageLabel = ROUTE_LABELS[pathname as keyof typeof ROUTE_LABELS]?.label;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        innerClassName="w-full max-w-5xl mx-auto"
        actions={
          <LogoutButton onSuccess={() => navigate({ to: "/auth/login" })} />
        }
      />
      <main className="flex-1 px-2 py-6 w-full max-w-5xl self-center flex flex-col md:grid md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr] gap-4">
        {pageLabel && (
          <h1 className="md:col-start-2 text-2xl font-bold hidden md:block">
            {pageLabel}
          </h1>
        )}
        <Navigation />
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
