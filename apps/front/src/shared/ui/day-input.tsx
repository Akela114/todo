import { twMerge } from "tailwind-merge";
import { formatDate } from "../common-helpers-and-constants";
import type { getInputValidation } from "../forms";
import { DayPicker } from "./day-picker";
import { InputWrapper } from "./input-wrapper";
import { Popover } from "./popover";

interface DayInputProps {
  value?: Date;
  placeholder?: string;
  label?: string;
  onChange: (value?: Date) => void;
  inputValidation?: ReturnType<typeof getInputValidation>;
  minDate?: Date;
  maxDate?: Date;
}

export const DayInput = ({
  value,
  placeholder,
  label,
  onChange,
  inputValidation,
  minDate,
  maxDate,
  ...otherProps
}: DayInputProps) => {
  return (
    <InputWrapper label={label} inputValidation={inputValidation}>
      <Popover
        {...otherProps}
        className={twMerge(
          "w-full border-1 border-base-content/20 rounded-sm text-sm bg-base-100 px-4 py-2 flex items-center justify-between gap-2 outline-base-content focus-within:outline-2 focus-within:outline-offset-2",
          inputValidation?.status === "success" &&
            "border-success outline-success",
          inputValidation?.status === "error" && "border-error outline-error",
        )}
        renderTarget={(onClose) => (
          <DayPicker
            selected={value}
            onSelect={(value) => {
              onChange(value);
              value && onClose();
            }}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
      >
        {value ? (
          formatDate(value, "date")
        ) : (
          <span className="text-base-content/50">{placeholder}</span>
        )}
      </Popover>
    </InputWrapper>
  );
};
