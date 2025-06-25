import type { ReactNode } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ComponentRef, Ref } from "react";
import { useSimpleListContext } from "./simple-list-context";

interface SimpleListItemProps {
  children: ReactNode;
  className?: string;
  ref?: Ref<ComponentRef<"li">>;
  initialAnimationDelayMultiplier?: number;
  isLastItem?: boolean;
}

const animationVariants = {
  initial: { filter: "blur(5px)", opacity: 0 },
  animate: (delayMultiplier: number) => ({
    filter: "blur(0px)",
    opacity: 1,
    transition: { delay: delayMultiplier * 0.1 },
  }),
  exit: { filter: "blur(5px)", opacity: 0 },
};

export const SimpleListItem = motion.create(
  ({
    children,
    initialAnimationDelayMultiplier = 0,
    isLastItem,
    ref,
  }: SimpleListItemProps) => {
    const { isLastItemInitiallyAnimated, setIsLastItemInitiallyAnimated } =
      useSimpleListContext();

    return (
      <motion.li
        layout
        custom={
          isLastItemInitiallyAnimated ? 0 : initialAnimationDelayMultiplier
        }
        variants={animationVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onAnimationComplete={(definition) => {
          if (isLastItem && definition === "animate") {
            setIsLastItemInitiallyAnimated(true);
          }
        }}
        className="bg-base-100 first:rounded-t-lg last:rounded-b-lg not-last:border-b border-b-base-200"
        ref={ref}
      >
        {children}
      </motion.li>
    );
  },
);
