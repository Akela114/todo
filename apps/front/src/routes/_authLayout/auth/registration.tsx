import { UserRegistrationForm } from "@/features/user";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authLayout/auth/registration")({
  component: RegistrationPage,
});

function RegistrationPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="card card-lg card-body gap-5 w-md">
        <div className="card-title">Регистрация</div>
        <UserRegistrationForm
          onSuccess={() => navigate({ to: "/auth/login" })}
        />
      </div>
      <Link to="/auth/login" className="link">
        Войти
      </Link>
    </div>
  );
}
