import { maskitoNumberOptionsGenerator } from "@maskito/kit";
import { useMaskito } from "@maskito/react";
import type { ComponentProps } from "react";
import { Input } from "./input";

type NumberInputProps = ComponentProps<typeof Input>;

const maskitoOptions = maskitoNumberOptionsGenerator();

export const NumberInput = ({ ref, ...props }: NumberInputProps) => {
  const maskedInputRef = useMaskito({ options: maskitoOptions });

  const componentRef = ref
    ? (e: HTMLInputElement) => {
        maskedInputRef(e);
        if (typeof ref === "function") {
          ref(e);
        } else if (ref) {
          ref.current = e;
        }
      }
    : maskedInputRef;

  return <Input {...props} ref={componentRef} inputMode="numeric" />;
};
