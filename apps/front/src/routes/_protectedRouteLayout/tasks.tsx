import { TasksList } from "@/widgets/tasks-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protectedRouteLayout/tasks")({
  component: MainPage,
});

function MainPage() {
  return <TasksList />;
}
