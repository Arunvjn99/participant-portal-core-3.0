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
        <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t("auth.phoneSupport")}
          </div>
          <a
            href="tel:1-800-555-0199"
            className="text-base text-primary no-underline hover:underline dark:text-blue-400"
          >
            1-800-555-0199
          </a>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t("auth.email")}
          </div>
          <a
            href="mailto:support@example.com"
            className="text-base text-primary no-underline hover:underline dark:text-blue-400"
          >
            support@example.com
          </a>
        </div>
      </div>
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
        title={t("auth.helpCenterTitle")}
        description={t("auth.helpCenterDesc")}
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};
