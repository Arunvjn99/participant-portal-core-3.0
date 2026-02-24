import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AuthLayout,
  AuthFormShell,
  AuthOTPInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";
import { useOtp } from "../../context/OtpContext";

export const VerifyCode = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setOtpVerified } = useOtp();

  const mode = searchParams.get("mode");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleVerify = () => {
    if (mode === "signup") {
      setShowSuccessModal(true);
    } else {
      setOtpVerified(true);
      navigate("/dashboard", { replace: true });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate("/", { replace: true });
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const headerSlot = <Logo className="h-10 w-auto" />;

  const bodySlot = (
    <>
      <AuthOTPInput onComplete={handleVerify} />
      <AuthButton onClick={handleVerify}>
        {t("auth.verifyContinue")}
      </AuthButton>
      <div className="flex flex-col items-center gap-3">
        <a
          href="#"
          className="text-sm text-[var(--color-primary)] no-underline hover:underline"
          onClick={(e) => e.preventDefault()}
          aria-label={t("auth.resendCode")}
        >
          {t("auth.resendCode")}
        </a>
        <a
          href="#"
          className="text-sm text-[var(--color-primary)] no-underline hover:underline"
          onClick={(e) => {
            e.preventDefault();
            handleBackToSignIn();
          }}
        >
          {t("auth.backToSignIn")}
        </a>
      </div>
    </>
  );

  return (
    <>
      <AuthLayout>
        <AuthFormShell
          headerSlot={headerSlot}
          title={t("auth.verificationCode")}
          description={t("auth.verificationCodeDesc")}
          bodySlot={bodySlot}
        />
      </AuthLayout>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-success)]" aria-hidden>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-[var(--color-text)]">
              Account Created!
            </h2>
            <p className="mb-6 text-sm text-[var(--color-textSecondary)]">
              Your account has been successfully created. Please sign in to continue.
            </p>
            <AuthButton onClick={handleSuccessClose} className="w-full">
              Go to Login
            </AuthButton>
          </div>
        </div>
      )}
    </>
  );
};
