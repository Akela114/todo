import type { ReactNode } from "@tanstack/react-router";
import { type Resolver, type UseFormProps, useForm } from "react-hook-form";
import { FormWrapper } from "../ui";

export const useDefaultForm = <
  T extends Record<string, unknown>,
  TTransformed = T,
>({
  resolver,
  useFormProps,
  submitButtonTitle,
  submitError,
  onSubmit,
  onResetSubmit,
  beforeSubmit,
  withResetOnSubmit,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: it is any in react-hook-form
  resolver: Resolver<T, any, TTransformed>;
  useFormProps: Omit<
    // biome-ignore lint/suspicious/noExplicitAny: it is any in react-hook-form
    UseFormProps<T, any, TTransformed>,
    "resolver"
  >;
  submitButtonTitle: string;
  onSubmit: (data: TTransformed) => Promise<unknown> | unknown;
  onResetSubmit: () => void;
  beforeSubmit?: (data: TTransformed) => void;
  submitError?: { message: string } | null;
  withResetOnSubmit?: boolean;
}) => {
  // biome-ignore lint/suspicious/noExplicitAny: it is any in react-hook-form
  const form = useForm<T, any, TTransformed>({
    ...useFormProps,
    resolver,
  });
  const { handleSubmit, reset, formState } = form;

  const getFormComponent = (children: ReactNode) => {
    return (
      <FormWrapper
        onSubmit={handleSubmit(async (data) => {
          beforeSubmit?.(data);
          await onSubmit(data);
          withResetOnSubmit && reset();
        })}
        onChange={submitError ? () => onResetSubmit() : undefined}
        submitButtonTitle={submitButtonTitle}
        isFormSubmitting={formState.isSubmitting}
        submitError={submitError}
      >
        {children}
      </FormWrapper>
    );
  };

  return {
    form,
    getFormComponent,
  };
};
