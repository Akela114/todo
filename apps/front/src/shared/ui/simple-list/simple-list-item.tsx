import type { ReactNode } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ComponentRef, Ref } from "react";

interface SimpleListItemProps {
  children: ReactNode;
  ref?: Ref<ComponentRef<"li">>;
}

const animationVariants = {
  initial: { opacity: 0 },
  animate: (delayMultiplier: number) => ({
    opacity: 1,
    transition: { delay: delayMultiplier * 0.05 },
  }),
  exit: (delayMultiplier: number) => ({
    opacity: 0,
    transition: { delay: delayMultiplier * 0.05 },
  }),
};

export const SimpleListItem = motion.create(
  ({ children, ref }: SimpleListItemProps) => {
    return (
      <motion.li
        layout
        variants={animationVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-base-100 first:rounded-t-lg last:rounded-b-lg not-last:border-b border-b-base-200"
        ref={ref}
      >
        {children}
      </motion.li>
    );
  },
);
