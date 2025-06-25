import { LoginForm } from "@/features/auth";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authLayout/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="w-md flex flex-col gap-5 items-center">
      <div className="card card-lg card-body gap-5 w-md">
        <div className="card-title">Вход</div>
        <LoginForm
          onSuccess={() => navigate({ to: "/inbox", search: { page: 1 } })}
        />
      </div>
      <Link to="/auth/registration" className="link">
        Зарегистрироваться
      </Link>
    </div>
  );
}
