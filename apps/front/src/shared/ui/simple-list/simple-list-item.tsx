import type { ReactNode } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

interface SimpleListProps {
  children: ReactNode;
  className?: string;
}

export const SimpleListItem = ({ children, className }: SimpleListProps) => {
  return <li className={twMerge("list-row", className)}>{children}</li>;
};
