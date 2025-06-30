import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { add, sub } from "date-fns";
import { twMerge } from "tailwind-merge";
import { formatDate } from "../common-helpers-and-constants";
import { DayPicker } from "./day-picker";
import { Popover } from "./popover";

interface DaySelectionProps {
  date: Date;
  onChange: (date?: Date) => void;
  className?: string;
  dayPickerTriggerClassName?: string;
}

export const DaySelection = ({
  date,
  onChange,
  className,
  dayPickerTriggerClassName,
}: DaySelectionProps) => {
  return (
    <div className={twMerge("flex items-center gap-2", className)}>
      <button
        className="btn btn-sm sm:btn-md btn-soft btn-square"
        type="button"
        onClick={() =>
          onChange(
            sub(date, {
              days: 1,
            }),
          )
        }
      >
        <ArrowLeftIcon />
      </button>
      <Popover
        className={twMerge(
          "btn btn-sm sm:btn-md btn-soft sm:min-w-62",
          dayPickerTriggerClassName,
        )}
        renderTarget={(onClose) => (
          <DayPicker
            selected={date}
            onSelect={(value) => {
              onChange(value);
              value && onClose();
            }}
          />
        )}
      >
        {formatDate(date, "weekdayDate")}
      </Popover>
      <button
        className="btn btn-sm sm:btn-md btn-soft btn-square"
        type="button"
        onClick={() =>
          onChange(
            add(date, {
              days: 1,
            }),
          )
        }
      >
        <ArrowRightIcon />
      </button>
    </div>
  );
};
