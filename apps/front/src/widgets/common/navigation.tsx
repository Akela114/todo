import type { FileRoutesByTo } from "@/routeTree.gen";
import { Link } from "@tanstack/react-router";

const LINKS: Partial<
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

export const Navigation = () => {
  const links = Object.entries(LINKS).map(([to, { label }]) => (
    <li key={to}>
      <Link to={to} activeProps={{ className: "menu-active" }}>
        {label}
      </Link>
    </li>
  ));

  return (
    <nav className="self-stretch">
      <ul className="menu bg-base-100 rounded-box min-w-44">{links}</ul>
    </nav>
  );
};
