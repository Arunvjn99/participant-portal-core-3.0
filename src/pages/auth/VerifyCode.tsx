import { useNavigate } from "react-router-dom";
import {
  AuthLayout,
  AuthFormShell,
  AuthOTPInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";

export const VerifyCode = () => {
  const navigate = useNavigate();

  const handleOTPComplete = () => {
    navigate("/dashboard");
  };

  const handleVerify = () => {
    navigate("/dashboard");
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const headerSlot = (
    <Logo className="h-10 w-auto" />
  );

  const bodySlot = (
    <>
      <AuthOTPInput onComplete={handleOTPComplete} />
      <AuthButton onClick={handleVerify}>Verify & continue</AuthButton>
      <div className="flex flex-col items-center gap-3">
        <a
          href="#"
          className="text-sm text-blue-600 no-underline hover:underline dark:text-blue-400"
          onClick={(e) => e.preventDefault()}
          aria-label="Resend verification code"
        >
          Resend code
        </a>
        <a
          href="#"
          className="text-sm text-blue-600 no-underline hover:underline dark:text-blue-400"
          onClick={(e) => {
            e.preventDefault();
            handleBackToSignIn();
          }}
        >
          Back to sign in
        </a>
      </div>
    </>
  );

  return (
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title="Verification code"
        description="We've sent a 6-digit code to your email address."
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};
