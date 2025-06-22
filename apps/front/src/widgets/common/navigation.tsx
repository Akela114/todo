import { ROUTE_LABELS } from "@/shared/router/route-labels";
import { Link } from "@tanstack/react-router";

export const Navigation = () => {
  const links = Object.entries(ROUTE_LABELS).map(([to, { label }]) => (
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
