import { useCreateUser } from "@/entities/user";
import { getInputValidation, useDefaultForm } from "@/shared/forms";
import { Input, PasswordInput } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateOrModifyUser,
  createOrModifyUserSchema,
} from "@packages/schemas/user";

interface UserRegistrationFormProps {
  onSuccess?: () => void;
}

export const UserRegistrationForm = ({
  onSuccess,
}: UserRegistrationFormProps) => {
  const {
    mutateAsync: createUser,
    error: submitError,
    reset: resetSubmit,
  } = useCreateUser({
    onSuccess,
  });

  const {
    form: { register, formState },
    getFormComponent,
  } = useDefaultForm<CreateOrModifyUser>({
    resolver: zodResolver(createOrModifyUserSchema),
    useFormProps: {},
    onResetSubmit: resetSubmit,
    onSubmit: (data) => createUser({ body: data }),
    submitButtonTitle: "Зарегистрироваться",
    submitError,
  });

  return getFormComponent(
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
    </div>,
  );
};
