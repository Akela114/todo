import type { FileRoutesByTo } from "@/routeTree.gen";

export const ROUTE_LABELS: Partial<
  Record<
    keyof FileRoutesByTo,
    {
      label: string;
    }
  >
> = {
  "/inbox": {
    label: "Входящие",
  },
  "/tasks": {
    label: "Задачи",
  },
};
