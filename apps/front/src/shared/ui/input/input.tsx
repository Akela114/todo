import type { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { getInputValidation } from "../../forms/form-utils";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
  description?: string;
  inputValidation?: ReturnType<typeof getInputValidation>;
  icon?: ReactNode;
}

export const Input = ({
  label,
  placeholder,
  inputValidation,
  icon,
  ...props
}: InputProps) => {
  const labelToShow = label ?? placeholder;
  const placeholderToShow = placeholder ?? label;

  return (
    <div className="flex flex-col gap-1">
      <label
        className={twMerge(
          "floating-label input w-full",
          inputValidation?.status === "success" && "input-success",
          inputValidation?.status === "error" && "input-error",
        )}
      >
        {icon}
        {labelToShow && <span>{labelToShow}</span>}
        <input {...props} placeholder={placeholderToShow} />
      </label>
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
