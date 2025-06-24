import {
  Select as RadixSelect,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface SelectProps
  extends Omit<ComponentProps<typeof SelectTrigger>, "onChange"> {
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  options: {
    value: string;
    label: string;
  }[];
  label?: string;
  onChange: (value: string) => void;
}

export const Select = ({
  defaultValue,
  value,
  placeholder,
  options,
  className,
  label,
  onChange,
  ...otherProps
}: SelectProps) => {
  const optionElements = options.map((option) => (
    <SelectItem
      key={option.value}
      value={option.value}
      className="px-4 py-2 hover:bg-base-200"
    >
      <SelectItemText>{option.label}</SelectItemText>
      <SelectItemIndicator />
    </SelectItem>
  ));

  return (
    <RadixSelect
      defaultValue={defaultValue}
      value={value}
      onValueChange={onChange}
    >
      <div className="relative">
        {label && (
          <div className="absolute top-0 -translate-y-1/2 left-4 text-[10.5px] bg-base-100">
            Приоритет
          </div>
        )}
        <SelectTrigger
          {...otherProps}
          className={twMerge(
            "w-full border-1 border-base-content/20 rounded-sm text-sm bg-base-100 px-4 py-2 flex items-center justify-between gap-2",
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
          <SelectIcon>
            <ChevronDownIcon />
          </SelectIcon>
        </SelectTrigger>
      </div>
      <SelectPortal>
        <SelectContent
          position="popper"
          className="bg-base-100 border-1 border-base-content/20 rounded-sm text-sm min-w-(--radix-select-trigger-width)"
        >
          <SelectViewport>{optionElements}</SelectViewport>
        </SelectContent>
      </SelectPortal>
    </RadixSelect>
  );
};
