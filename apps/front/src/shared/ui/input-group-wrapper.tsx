import type { ReactNode } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import type { getInputValidation } from "../forms";
import { InputWrapper } from "./input-wrapper";

interface InputGroupWrapperProps {
  label?: string;
  inputValidation?: ReturnType<typeof getInputValidation>;
  children: ReactNode;
  className?: string;
}

export const InputGroupWrapper = ({
  label,
  inputValidation,
  children,
  className,
}: InputGroupWrapperProps) => {
  return (
    <InputWrapper inputValidation={inputValidation} label={label}>
      <div
        className={twMerge(
          "flex flex-col gap-5 p-4 pt-5 relative border-1 border-base-content/20 rounded-sm",
          inputValidation?.status === "success" &&
            "border-success outline-success",
          inputValidation?.status === "error" && "border-error outline-error",
          className,
        )}
      >
        {children}
      </div>
    </InputWrapper>
  );
};
