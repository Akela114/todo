import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { WEEK_DAYS } from "../common-helpers-and-constants/weekdays";
import type { getInputValidation } from "../forms";
import { InputWrapper } from "./input-wrapper";

interface WeekdaysPickerProps extends Omit<ComponentProps<"div">, "onChange"> {
  selected: number[];
  onChange: (weekdays: number[]) => void;
  label?: string;
  inputValidation?: ReturnType<typeof getInputValidation>;
}

export const WeekdaysPicker = ({
  selected,
  onChange,
  className,
  label,
  inputValidation,
  ...props
}: WeekdaysPickerProps) => {
  const handleWeekdayChange = (day: keyof typeof WEEK_DAYS) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day]);
    }
  };

  const weekdayCheckboxes = Object.entries(WEEK_DAYS).map(([key, value]) => {
    const keyNum = Number(key) as keyof typeof WEEK_DAYS;

    return (
      <label key={key}>
        <input
          type="checkbox"
          className="hidden [&:checked+div]:btn-primary"
          checked={selected.includes(keyNum)}
          onChange={() => handleWeekdayChange(keyNum)}
        />
        <div className="btn btn-soft btn-sm btn-square">{value}</div>
      </label>
    );
  });

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
      <div className={twMerge("flex gap-2", className)} {...props}>
        {weekdayCheckboxes}
      </div>
    </InputWrapper>
  );
};
