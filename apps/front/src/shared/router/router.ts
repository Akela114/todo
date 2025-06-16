import { routeTree } from "@/routeTree.gen";
import { createRouter } from "@tanstack/react-router";

export const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});
