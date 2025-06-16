import { loginSchema, useLogin } from "@/entities/auth";
import { getInputValidation } from "@/shared/lib/form-utilts";
import { Input, PasswordInput } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { mutateAsync: login } = useLogin({
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
      <button type="submit" className="btn btn-primary">
        Войти
      </button>
    </form>
  );
};
