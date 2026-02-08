import { useNavigate } from "react-router-dom";
import {
  AuthLayout,
  AuthFormShell,
  AuthPasswordInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";

export const ResetPassword = () => {
  const navigate = useNavigate();

  const handleResetPassword = () => {
    navigate("/");
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const headerSlot = (
    <Logo className="h-10 w-auto" />
  );

  const bodySlot = (
    <>
      <AuthPasswordInput
        label="New password"
        name="newPassword"
        id="newPassword"
        placeholder="Enter your new password"
      />
      <AuthPasswordInput
        label="Confirm password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirm your new password"
      />
      <AuthButton onClick={handleResetPassword}>Reset password</AuthButton>
      <a
        href="#"
        className="text-center text-sm text-blue-600 no-underline hover:underline dark:text-blue-400"
        onClick={(e) => {
          e.preventDefault();
          handleBackToSignIn();
        }}
      >
        Back to sign in
      </a>
    </>
  );

  return (
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title="Reset your password"
        description="Your password must be at least 8 characters long and include a mix of letters, numbers, and special characters."
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};
