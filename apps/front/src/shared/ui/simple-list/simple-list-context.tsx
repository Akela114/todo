import type { ReactNode } from "@tanstack/react-router";
import { createContext, useContext, useState } from "react";

interface SimpleListContext {
  isLastItemInitiallyAnimated: boolean;
  setIsLastItemInitiallyAnimated: (isAnimated: boolean) => void;
}

interface SimpleListContextProviderProps {
  children: ReactNode;
}

const SimpleListContext = createContext<SimpleListContext | null>(null);

export const SimpleListContextProvider = ({
  children,
}: SimpleListContextProviderProps) => {
  const [isLastItemInitiallyAnimated, setIsLastItemInitiallyAnimated] =
    useState(false);

  return (
    <SimpleListContext.Provider
      value={{ isLastItemInitiallyAnimated, setIsLastItemInitiallyAnimated }}
    >
      {children}
    </SimpleListContext.Provider>
  );
};

export const useSimpleListContext = () => {
  const context = useContext(SimpleListContext);

  if (!context) {
    throw new Error("useSimpleListContext must be used within a provider");
  }

  return context;
};
