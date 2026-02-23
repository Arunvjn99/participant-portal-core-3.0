import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AuthLayout,
  AuthFormShell,
  AuthInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendResetLink = () => {
    navigate("/forgot/verify", { state: { email: email.trim() } });
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
        label={t("auth.email")}
        type="email"
        name="email"
        id="email"
        placeholder={t("auth.enterYourEmail")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthButton onClick={handleSendResetLink}>{t("auth.sendResetLink")}</AuthButton>
      <a
        href="#"
        className="text-center text-sm text-primary no-underline hover:underline dark:text-blue-400"
        onClick={(e) => {
          e.preventDefault();
          handleBackToSignIn();
        }}
      >
        {t("auth.backToSignIn")}
      </a>
    </>
  );

  return (
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title={t("auth.forgotPasswordTitle")}
        description={t("auth.forgotPasswordDesc")}
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};
