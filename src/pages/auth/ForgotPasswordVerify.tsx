import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AuthLayout,
  AuthFormShell,
  AuthOTPInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";

export const ForgotPasswordVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";
  const [otpValue, setOtpValue] = useState<string>("");

  const handleOTPComplete = (value: string) => {
    setOtpValue(value);
    if (value.length === 6) {
      navigate("/reset", { state: { email } });
    }
  };

  const handleVerify = () => {
    navigate("/reset", { state: { email } });
  };

  const handleResend = () => {
    // In a real app, would resend the code to email
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const headerSlot = <Logo className="h-10 w-auto" />;

  const bodySlot = (
    <>
      <AuthOTPInput onComplete={handleOTPComplete} />
      <AuthButton onClick={handleVerify} disabled={otpValue.length !== 6}>
        Verify & continue
      </AuthButton>
      <div className="flex flex-col items-center gap-3">
        <a
          href="#"
          className="text-sm text-blue-600 no-underline hover:underline dark:text-blue-400"
          onClick={(e) => {
            e.preventDefault();
            handleResend();
          }}
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
        description={
          email
            ? `We've sent a 6-digit code to ${email}. Enter it below.`
            : "We've sent a 6-digit code to your email address. Enter it below."
        }
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};
