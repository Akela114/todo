import { twMerge } from "tailwind-merge";
import { formatDate } from "../common-helpers";
import type { getInputValidation } from "../forms";
import { DayPicker } from "./day-picker";
import { Popover } from "./popover";

interface DayInputProps {
  value?: Date;
  placeholder?: string;
  label?: string;
  onChange: (value?: Date) => void;
  inputValidation?: ReturnType<typeof getInputValidation>;
}

export const DayInput = ({
  value,
  placeholder,
  label,
  onChange,
  inputValidation,
  ...otherProps
}: DayInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        {label && (
          <div
            className={twMerge(
              "absolute top-0 -translate-y-1/2 left-4 text-[10.5px] bg-base-100 z-10",
              inputValidation?.status === "success" && "text-success",
              inputValidation?.status === "error" && "text-error",
            )}
          >
            {label}
          </div>
        )}
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
            />
          )}
        >
          {value ? (
            formatDate(value, "date")
          ) : (
            <span className="text-base-content/50">{placeholder}</span>
          )}
        </Popover>
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
