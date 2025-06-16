import { checkAuth } from "@/entities/auth";
import { LoadingScreen } from "@/shared/ui/loading-wrapper";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authLayout")({
  component: AuthLayout,
  pendingComponent: LoadingScreen,
  pendingMinMs: 300,
  beforeLoad: async () => {
    try {
      await checkAuth();
    } catch {
      return;
    }
    throw redirect({ to: "/" });
  },
});

function AuthLayout() {
  return (
    <div className="flex items-center justify-center flex-1 px-2 py-6">
      <Outlet />
    </div>
  );
}
