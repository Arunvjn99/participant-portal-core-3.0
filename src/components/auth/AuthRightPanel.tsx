import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../ui/ThemeToggle";
import { Dropdown } from "../ui/Dropdown";
import { AuthFooter } from "./AuthFooter";

interface AuthRightPanelProps {
  children: ReactNode;
}

/**
 * Right panel: flex flex-col min-h-screen.
 * Logo + form in flex-1; footer as last child, bottom-aligned.
 * Theme-aware. No fixed/absolute positioning.
 * Top bar: theme toggle + language switcher (global header).
 */
export const AuthRightPanel = ({ children }: AuthRightPanelProps) => {
  const { t, i18n } = useTranslation("common");
  const languageOptions = [
    { value: "en", label: t("labels.english") },
    { value: "es", label: t("labels.spanish") },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-slate-900">
      <div className="flex flex-1 flex-col min-h-0">
        <div className="flex shrink-0 items-center justify-end gap-2 px-4 py-4 md:px-8 lg:px-12">
          <div className="w-[7rem]">
            <Dropdown
              label=""
              value={i18n.language}
              options={languageOptions}
              onChange={(lng) => i18n.changeLanguage(lng)}
              placeholder={t("labels.language")}
            />
          </div>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-4 md:px-8 md:py-8 lg:px-12 lg:py-12">
          <div className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40 md:p-8 lg:p-10">
            {children}
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};
