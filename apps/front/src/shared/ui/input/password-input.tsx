import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { type ComponentProps, useState } from "react";
import { Input } from "./input";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type">;

export const PasswordInput = (props: PasswordInputProps) => {
  const [inputType, setInputType] = useState<"password" | "text">("password");

  return (
    <Input
      {...props}
      type={inputType}
      icon={
        <button
          tabIndex={-1}
          className="size-4"
          type="button"
          onClick={() => {
            setInputType((prev) => (prev === "password" ? "text" : "password"));
          }}
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
