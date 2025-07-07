import type { ReactNode } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ComponentRef, Ref } from "react";

interface SimpleListItemProps {
  children: ReactNode;
  ref?: Ref<ComponentRef<"li">>;
}

export const SimpleListItem = motion.create(
  ({ children, ref }: SimpleListItemProps) => {
    return (
      <motion.li
        layout="position"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-base-100 rounded"
        ref={ref}
      >
        {children}
      </motion.li>
    );
  },
);
