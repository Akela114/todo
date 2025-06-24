import type { ReactNode } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ComponentRef, Ref } from "react";

interface SimpleListProps {
  children: ReactNode;
  className?: string;
  ref?: Ref<ComponentRef<"li">>;
}

export const SimpleListItem = motion.create(
  ({ children, ref }: SimpleListProps) => {
    return (
      <motion.li
        layout
        initial={{ filter: "blur(5px)", opacity: 0 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        exit={{ filter: "blur(5px)", opacity: 0 }}
        className="bg-base-100 first:rounded-t-lg last:rounded-b-lg not-last:border-b border-b-base-200"
        ref={ref}
      >
        {children}
      </motion.li>
    );
  },
);
