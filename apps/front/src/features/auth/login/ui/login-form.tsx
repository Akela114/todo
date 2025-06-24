import { useLogin } from "@/entities/auth";
import { getInputValidation } from "@/shared/forms";
import { Input, PasswordInput } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@packages/schemas/auth";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const {
    mutateAsync: login,
    error,
    isPending,
    reset: resetSubmit,
  } = useLogin({
    onSuccess,
  });

  const { handleSubmit, register, reset, formState } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await login({
          body: data,
        });
        reset();
      })}
      onChange={resetSubmit}
      className="flex flex-col gap-5"
    >
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
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          className={"btn btn-primary"}
          disabled={isPending || !!error}
        >
          Войти
        </button>
        {error && <div className="text-error text-xs">{error.message}</div>}
      </div>
    </form>
  );
};
