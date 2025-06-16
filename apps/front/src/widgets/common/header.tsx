import { Link } from "@tanstack/react-router";

interface HeaderProps {
  actions?: React.ReactNode;
}

export const Header = ({ actions }: HeaderProps) => {
  return (
    <header className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <Link className="btn btn-ghost text-xl" to="/">
          todo
        </Link>
      </div>
      {actions && <div className="navbar-end">{actions}</div>}
    </header>
  );
};
