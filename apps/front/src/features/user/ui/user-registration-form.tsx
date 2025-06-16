import { createUserSchema, useCreateUser } from "@/entities/user";
import { getInputValidation } from "@/shared/lib/form-utilts";
import { Input, PasswordInput } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface UserRegistrationFormProps {
  onSuccess?: () => void;
}

export const UserRegistrationForm = ({
  onSuccess,
}: UserRegistrationFormProps) => {
  const { mutateAsync: createUser } = useCreateUser({
    onSuccess,
  });

  const { handleSubmit, register, reset, formState } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await createUser({
          body: data,
        });
        reset();
      })}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-3">
        <Input
          {...register("email")}
          label="Email"
          placeholder="Введите email..."
          inputValidation={getInputValidation(formState, "email")}
        />
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
        Зарегистрироваться
      </button>
    </form>
  );
};
