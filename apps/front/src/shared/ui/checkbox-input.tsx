import type { ReactNode } from "@tanstack/react-router";
import type { ComponentProps } from "react";

type CheckboxInputProps = Omit<
  ComponentProps<"input">,
  "className" | "type"
> & {
  children: ReactNode;
};

export const CheckboxInput = ({ children, ...props }: CheckboxInputProps) => {
  return (
    <label className="flex gap-2 text-sm">
      <input {...props} type="checkbox" className="checkbox checkbox-sm" />
      <div>{children}</div>
    </label>
  );
};
