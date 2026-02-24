import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { PersonaProfile } from "@/mock/personas";

interface ScenarioShellProps {
  user: PersonaProfile;
  accentColor: string;
  children: ReactNode;
}

/**
 * Shared shell for scenario dashboards.
 * Renders a greeting banner + the scenario-specific content.
 */
export function ScenarioShell({ user, accentColor, children }: ScenarioShellProps) {
  const { t } = useTranslation();
  const label = t(`demo.scenario_${user.scenario}` as const);
  const formatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting banner */}
      <div
        className="rounded-xl border p-5 sm:p-6"
        style={{ borderColor: `${accentColor}33`, backgroundColor: `${accentColor}08` }}
      >
        <p className="text-sm font-medium text-[var(--color-textSecondary)]">
          {t("demo.welcomeBack")}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
          {user.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--color-textSecondary)]">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
            style={{ backgroundColor: accentColor }}
          >
            {label}
          </span>
          <span>{t("demo.age")} {user.age}</span>
          <span className="hidden sm:inline">•</span>
          <span>{t("demo.balance")}: {formatter.format(user.balance)}</span>
          {user.retirementScore > 0 && (
            <>
              <span className="hidden sm:inline">•</span>
              <span>{t("demo.retirementScore")}: {user.retirementScore}</span>
            </>
          )}
        </div>
      </div>

      {/* Scenario-specific content */}
      {children}
    </div>
  );
}
