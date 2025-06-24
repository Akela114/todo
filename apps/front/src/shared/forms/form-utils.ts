import type { FieldValues, FormState } from "react-hook-form";

export const getInputValidation = <Values extends FieldValues>(
  formState: FormState<Values>,
  inputName: keyof Values
) => {
  const error = formState.errors[inputName];

  const getInputStatus = () => {
    if (error) {
      return "error" as const;
    }

    if (formState.isSubmitted && formState.isDirty) {
      return "success" as const;
    }
  };

  return {
    status: getInputStatus(),
    message: error?.message?.toString(),
  };
};
