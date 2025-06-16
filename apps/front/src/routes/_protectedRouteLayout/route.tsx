import { checkAuth } from "@/entities/auth";
import { LogoutButton } from "@/features/auth";
import { LoadingScreen } from "@/shared/ui/loading-wrapper";
import { Header } from "@/widgets/common";
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await checkAuth();
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
      <main className="flex-1 px-2 py-6 w-full max-w-5xl self-center">
        <Outlet />
      </main>
    </div>
  );
}
