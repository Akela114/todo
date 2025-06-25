import type { ReactNode } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { SimpleListContextProvider } from "./simple-list-context";

interface SimpleListProps {
  children: ReactNode;
}

export const SimpleList = ({ children }: SimpleListProps) => {
  return (
    <SimpleListContextProvider>
      <motion.ul className="rounded-box list">
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
      </motion.ul>
    </SimpleListContextProvider>
  );
};
