import type { ReactNode } from "@tanstack/react-router";
import type { ComponentProps } from "react";

interface FormWrapperProps {
  children: ReactNode;
  submitError?: { message: string } | null;
  submitButtonTitle: string;
  isFormSubmitting: boolean;
  onSubmit: ComponentProps<"form">["onSubmit"];
  onChange: ComponentProps<"form">["onChange"];
}

export const FormWrapper = ({
  children,
  submitButtonTitle,
  submitError,
  isFormSubmitting,
  onSubmit,
  onChange,
}: FormWrapperProps) => {
  return (
    <form
      onSubmit={onSubmit}
      onChange={onChange}
      className="flex flex-col gap-5"
    >
      {children}
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          className={"btn btn-primary"}
          disabled={isFormSubmitting || !!submitError}
        >
          {submitButtonTitle}
        </button>
        {submitError && (
          <div className="text-error text-xs">{submitError.message}</div>
        )}
      </div>
    </form>
  );
};
