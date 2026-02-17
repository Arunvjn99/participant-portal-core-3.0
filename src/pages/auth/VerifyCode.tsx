import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AuthLayout,
  AuthFormShell,
  AuthOTPInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";

export const VerifyCode = () => {
  const { t } = useTranslation();
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
      <AuthButton onClick={handleVerify}>{t("auth.verifyContinue")}</AuthButton>
      <div className="flex flex-col items-center gap-3">
        <a
          href="#"
          className="text-sm text-blue-600 no-underline hover:underline dark:text-blue-400"
          onClick={(e) => e.preventDefault()}
          aria-label={t("auth.resendCode")}
        >
          {t("auth.resendCode")}
        </a>
        <a
          href="#"
          className="text-sm text-blue-600 no-underline hover:underline dark:text-blue-400"
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
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title={t("auth.verificationCode")}
        description={t("auth.verificationCodeDesc")}
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};
