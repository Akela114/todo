import type { FieldPath, FieldValues, FormState } from "react-hook-form";

export const getInputValidation = <Values extends FieldValues>(
  formState: FormState<Values>,
  inputName: FieldPath<Values>,
) => {
  const splittedInputName = inputName.split(".");

  // biome-ignore lint/suspicious/noExplicitAny: type is changing over time
  let error: any = formState.errors;

  for (let i = 0; i < splittedInputName.length; i++) {
    error = error?.[splittedInputName[i]];
  }

  error = error?.root ?? error;

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
