import type { getInputValidation } from "@/shared/forms";
import type { ReactNode } from "@tanstack/react-router";
import type { ComponentRef, Ref } from "react";
import { twMerge } from "tailwind-merge";
import { InputWrapper } from "../input-wrapper";
import { Popover } from "../popover";
import { MultiselectOption } from "./multiselect-option";
import { MultiselectSelectedOption } from "./multiselect-selected-option";

type MultiselectProps<T extends string | number> = {
  selectedValues: T[];
  options: {
    value: T;
    label: string;
  }[];
  onChange: (selectedValues: T[]) => void;
  topElement?: ReactNode;
  bottomElement?: ReactNode;
  label?: string;
  inputValidation?: ReturnType<typeof getInputValidation>;
  ref?: Ref<ComponentRef<"div">>;
  placeholder?: string;
};

export const Multiselect = <T extends string | number>({
  options,
  selectedValues,
  onChange,
  topElement,
  bottomElement,
  label,
  inputValidation,
  ref,
  placeholder,
}: MultiselectProps<T>) => {
  const handleOptionClick = (value: T) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectedOptionElements = selectedValues.map((value) => (
    <MultiselectSelectedOption
      key={value}
      value={value}
      label={options.find((o) => o.value === value)?.label ?? String(value)}
      onRemove={handleOptionClick}
    />
  ));

  const optionElements = options.map(({ label, value }) => (
    <MultiselectOption
      key={value}
      value={value}
      label={label}
      isSelected={selectedValues.includes(value)}
      onClick={handleOptionClick}
    />
  ));

  return (
    <InputWrapper label={label} inputValidation={inputValidation}>
      <Popover
        sideOffset={0}
        renderTarget={() => (
          <div className="bg-base-100 border-1 border-base-content/20 rounded-sm text-sm">
            {topElement}
            <div
              className={twMerge(
                topElement && "border-t border-base-content/20",
                bottomElement && "border-b border-base-content/20",
              )}
            >
              {optionElements}
            </div>
            {bottomElement}
          </div>
        )}
      >
        <div
          ref={ref}
          className={twMerge(
            "w-full border-1 border-base-content/20 rounded-sm text-sm bg-base-100 px-4 py-3 flex items-center flex-wrap gap-2 outline-base-content",
            inputValidation?.status === "success" &&
              "border-success outline-success",
            inputValidation?.status === "error" && "border-error outline-error",
          )}
        >
          {selectedOptionElements.length ? selectedOptionElements : placeholder}
        </div>
      </Popover>
    </InputWrapper>
  );
};
