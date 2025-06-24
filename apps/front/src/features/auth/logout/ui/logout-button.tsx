import { useLogout } from "@/entities/auth";
import { ExitIcon } from "@radix-ui/react-icons";

interface LogoutButtonProps {
  onSuccess?: () => void;
}

export const LogoutButton = ({ onSuccess }: LogoutButtonProps) => {
  const { mutate: logout } = useLogout({
    onSuccess,
  });

  return (
    <button
      type="button"
      className="btn btn-soft self-start"
      onClick={() => logout()}
    >
      <ExitIcon />
      Выход
    </button>
  );
};
