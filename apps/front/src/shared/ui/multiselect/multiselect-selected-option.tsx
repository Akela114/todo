import { Cross2Icon } from "@radix-ui/react-icons";

interface MultiselectOptionProps<T extends string | number> {
  value: T;
  label: string;
  onRemove: (value: T) => void;
}

export const MultiselectSelectedOption = <T extends string | number>({
  value,
  label,
  onRemove,
}: MultiselectOptionProps<T>) => {
  return (
    <div className="badge badge-soft flex gap-2 items-center">
      {label}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(value);
        }}
      >
        <Cross2Icon />
      </button>
    </div>
  );
};
