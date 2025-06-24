import { useLogin } from "@/entities/auth";
import { getInputValidation, useDefaultForm } from "@/shared/forms";
import { Input, PasswordInput } from "@/shared/ui";
import { loginSchema } from "@packages/schemas/auth";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const {
    mutateAsync: login,
    error: submitError,
    reset: resetSubmit,
  } = useLogin({
    onSuccess,
  });

  const {
    form: { register, formState },
    getFormComponent,
  } = useDefaultForm({
    schema: loginSchema,
    useFormProps: {
      defaultValues: {
        username: "",
        password: "",
      },
    },
    onResetSubmit: resetSubmit,
    onSubmit: (data) => login({ body: data }),
    submitButtonTitle: "Войти",
    submitError,
  });

  return getFormComponent(
    <div className="flex flex-col gap-3">
      <Input
        {...register("username")}
        label="Имя пользователя"
        placeholder="Введите имя пользователя..."
        inputValidation={getInputValidation(formState, "username")}
      />
      <PasswordInput
        {...register("password")}
        label="Пароль"
        placeholder="Введите пароль..."
        inputValidation={getInputValidation(formState, "password")}
      />
    </div>,
  );
};
