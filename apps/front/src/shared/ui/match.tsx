import type { ReactNode } from "@tanstack/react-router";

type MatchProps<T extends string | number> = {
  value: T;
} & Record<T, () => ReactNode>;

export const Match = <T extends string | number>(props: MatchProps<T>) => {
  return props[props.value]();
};
