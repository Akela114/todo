import type { ReactNode } from "@tanstack/react-router";

interface SimpleListProps {
  children: ReactNode;
}

export const SimpleList = ({ children }: SimpleListProps) => {
  return <ul className="list bg-base-100 rounded-box shadow-md">{children}</ul>;
};
