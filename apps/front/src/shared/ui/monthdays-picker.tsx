import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import type { getInputValidation } from "../forms";
import { InputWrapper } from "./input-wrapper";

interface MonthdaysPickerProps extends Omit<ComponentProps<"div">, "onChange"> {
  selected: number[];
  onChange: (weekdays: number[]) => void;
  label?: string;
  inputValidation?: ReturnType<typeof getInputValidation>;
}

export const MonthDaysPicker = ({
  selected,
  onChange,
  className,
  label,
  inputValidation,
  ...props
}: MonthdaysPickerProps) => {
  const handleMonthdayChange = (day: number) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day]);
    }
  };

  const monthdayCheckboxes = Array.from({ length: 31 }, (_, idx) => (
    <label key={idx}>
      <input
        type="checkbox"
        className="hidden [&:checked+div]:btn-primary"
        checked={selected.includes(idx + 1)}
        onChange={() => handleMonthdayChange(idx + 1)}
      />
      <div className="btn btn-soft btn-sm btn-square">{idx + 1}</div>
    </label>
  ));

  return (
    <InputWrapper
      label={label}
      inputValidation={inputValidation}
      className={twMerge(
        "w-full p-4 relative border-1 border-base-content/20 rounded-sm",
        inputValidation?.status === "success" &&
          "border-success outline-success",
        inputValidation?.status === "error" && "border-error outline-error",
      )}
    >
      <div className={twMerge("flex gap-2 flex-wrap", className)} {...props}>
        {monthdayCheckboxes}
      </div>
    </InputWrapper>
  );
};
