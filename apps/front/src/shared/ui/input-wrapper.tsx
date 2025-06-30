import type { ReactNode } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import type { getInputValidation } from "../forms";

interface InputWrapperProps {
  label?: string;
  inputValidation?: ReturnType<typeof getInputValidation>;
  children: ReactNode;
  className?: string;
}

export const InputWrapper = ({
  label,
  inputValidation,
  children,
  className,
}: InputWrapperProps) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <div className={twMerge("relative", className)}>
        {label && (
          <div
            className={twMerge(
              "z-10 absolute top-0 -translate-y-1/2 left-4 right-1 text-[10.5px] bg-base-100 truncate max-w-fit",
              inputValidation?.status === "success" && "text-success",
              inputValidation?.status === "error" && "text-error",
            )}
          >
            {label}
          </div>
        )}
        {children}
      </div>
      {inputValidation?.message && (
        <div
          className={twMerge(
            "text-xs min-h-4",
            inputValidation.status === "success" && "text-success",
            inputValidation.status === "error" && "text-error",
          )}
        >
          {inputValidation.message}
        </div>
      )}
    </div>
  );
};
