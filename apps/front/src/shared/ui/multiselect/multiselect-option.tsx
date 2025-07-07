import { CheckIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";

interface MultiselectOptionProps<T extends string | number> {
  value: T;
  label: string;
  isSelected?: boolean;
  onClick: (value: T) => void;
}

export const MultiselectOption = <T extends string | number>({
  value,
  label,
  isSelected,
  onClick,
}: MultiselectOptionProps<T>) => {
  return (
    <button
      type="button"
      className={twMerge(
        "px-4 py-2 hover:bg-base-300 w-full justify-between flex items-center gap-2 transition-colors",
        isSelected && "bg-base-2001 ",
      )}
      onClick={() => onClick(value)}
    >
      {label}
      {isSelected && <CheckIcon />}
    </button>
  );
};
