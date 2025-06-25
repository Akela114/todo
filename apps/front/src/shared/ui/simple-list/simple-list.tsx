import type { ReactNode } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

interface SimpleListProps {
  children: ReactNode;
}

export const SimpleList = ({ children }: SimpleListProps) => {
  return (
    <motion.ul className="rounded-box list">
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </motion.ul>
  );
};
