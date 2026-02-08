import { useNavigate } from "react-router-dom";
import {
  AuthLayout,
  AuthFormShell,
  AuthInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSendResetLink = () => {
    navigate("/reset");
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const headerSlot = (
    <Logo className="h-10 w-auto" />
  );

  const bodySlot = (
    <>
      <AuthInput
        label="Email"
        type="email"
        name="email"
        id="email"
        placeholder="Enter your email address"
      />
      <AuthButton onClick={handleSendResetLink}>Send reset link</AuthButton>
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
        title="Forgot your password?"
        description="Enter your email address and we'll send you a link to reset your password."
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};
