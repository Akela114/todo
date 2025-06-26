import { ROUTE_LABELS } from "@/shared/router";
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
      <ul className="w-full menu menu-horizontal bg-base-100 rounded-box min-w-44">
        {links}
      </ul>
    </nav>
  );
};
