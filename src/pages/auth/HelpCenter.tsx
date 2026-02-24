import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AuthLayout,
  AuthFormShell,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";

export const HelpCenter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const headerSlot = (
    <Logo className="h-10 w-auto" />
  );

  const bodySlot = (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="text-sm font-medium text-[var(--color-textSecondary)]">
            {t("auth.phoneSupport")}
          </div>
          <a
            href="tel:1-800-555-0199"
            className="text-base text-[var(--color-primary)] no-underline hover:underline"
          >
            1-800-555-0199
          </a>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="text-sm font-medium text-[var(--color-textSecondary)]">
            {t("auth.email")}
          </div>
          <a
            href="mailto:support@example.com"
            className="text-base text-[var(--color-primary)] no-underline hover:underline"
          >
            support@example.com
          </a>
        </div>
      </div>
      <a
        href="#"
        className="text-center text-sm text-[var(--color-primary)] no-underline hover:underline"
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
        title={t("auth.helpCenterTitle")}
        description={t("auth.helpCenterDesc")}
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};
