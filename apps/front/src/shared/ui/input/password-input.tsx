import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import {
  type ComponentProps,
  type ComponentRef,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Input } from "./input";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type">;

export const PasswordInput = (props: PasswordInputProps) => {
  const [inputType, setInputType] = useState<"password" | "text">("password");

  const inputRef = useRef<ComponentRef<"input">>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: should be called on inputType change
  useLayoutEffect(() => {
    inputRef.current?.setSelectionRange(
      inputRef.current.value.length,
      inputRef.current.value.length,
    );
  }, [inputType]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Input
      {...props}
      ref={(e) => {
        inputRef.current = e;
        if (typeof props.ref === "function") {
          props.ref(e);
        } else if (props.ref) {
          props.ref.current = e;
        }
      }}
      type={inputType}
      icon={
        <button
          tabIndex={-1}
          className="size-4"
          type="button"
          onClick={() => {
            setInputType((prev) => (prev === "password" ? "text" : "password"));
          }}
          onFocus={focusInput}
        >
          {inputType === "password" ? (
            <EyeOpenIcon className="pointer-events-none" />
          ) : (
            <EyeNoneIcon className="pointer-events-none" />
          )}
        </button>
      }
    />
  );
};
