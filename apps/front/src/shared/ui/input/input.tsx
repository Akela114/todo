import type { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { getInputValidation } from "../../forms/form-utils";
import { InputWrapper } from "../input-wrapper";

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
    <InputWrapper label={labelToShow} inputValidation={inputValidation}>
      <label
        className={twMerge(
          "input w-full",
          inputValidation?.status === "success" && "input-success",
          inputValidation?.status === "error" && "input-error",
        )}
      >
        {icon}
        <input {...props} placeholder={placeholderToShow} />
      </label>
    </InputWrapper>
  );
};
