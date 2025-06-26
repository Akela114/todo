import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { add, sub } from "date-fns";
import { formatDate } from "../common-helpers";
import { DayPicker } from "./day-picker";
import { Popover } from "./popover";

interface DaySelectionProps {
  date: Date;
  onChange: (date?: Date) => void;
}

export const DaySelection = ({ date, onChange }: DaySelectionProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-soft btn-square"
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
        className="btn btn-soft flex-1 sm:flex-none"
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
        className="btn btn-soft btn-square"
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
