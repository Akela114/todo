import { Link } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  actions?: React.ReactNode;
  innerClassName?: string;
}

export const Header = ({ actions, innerClassName }: HeaderProps) => {
  return (
    <header className="bg-base-100 shadow-sm">
      <div className={twMerge("navbar", innerClassName)}>
        <div className="navbar-start">
          <Link className="btn btn-ghost text-xl" to="/inbox">
            todo
          </Link>
        </div>
        {actions && <div className="navbar-end">{actions}</div>}
      </div>
    </header>
  );
};
