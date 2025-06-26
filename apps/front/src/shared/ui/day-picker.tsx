import type { ComponentProps } from "react";
import { DayPicker as DayPickerReact } from "react-day-picker";
import { ru } from "react-day-picker/locale";

interface DayPickerProps
  extends Omit<
    ComponentProps<typeof DayPickerReact>,
    "locale" | "className" | "mode" | "required"
  > {
  selected?: Date;
  onSelect: (date?: Date) => void;
}

export const DayPicker = ({
  selected,
  onSelect,
  ...otherProps
}: DayPickerProps) => {
  return (
    <DayPickerReact
      {...otherProps}
      mode="single"
      selected={selected}
      className="react-day-picker"
      locale={ru}
      onSelect={onSelect}
    />
  );
};
