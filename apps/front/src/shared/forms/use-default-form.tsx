import { useForm, type UseFormProps } from "react-hook-form";
import { FormWrapper } from "../ui";
import type { ReactNode } from "@tanstack/react-router";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const useDefaultForm = <T extends z.ZodObject<z.ZodRawShape>>({
  schema,
  useFormProps,
  submitButtonTitle,
  submitError,
  onSubmit,
  onResetSubmit,
  beforeSubmit,
}: {
  schema: T;
  useFormProps: Omit<
    // biome-ignore lint/suspicious/noExplicitAny: it is any in react-hook-form
    UseFormProps<z.infer<T>, any, z.infer<T>>,
    "resolver"
  >;
  submitButtonTitle: string;
  onSubmit: (data: z.infer<T>) => Promise<unknown> | unknown;
  onResetSubmit: () => void;
  beforeSubmit?: (data: z.infer<T>) => void;
  submitError?: { message: string } | null;
}) => {
  const form = useForm({
    ...useFormProps,
    resolver: zodResolver(schema),
  });
  const { handleSubmit, reset, formState } = form;

  const getFormComponent = (children: ReactNode) => {
    return (
      <FormWrapper
        onSubmit={handleSubmit(async (data) => {
          beforeSubmit?.(data);
          await onSubmit(data);
          reset();
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
