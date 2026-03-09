import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SIMPLIFIED_STEPS = [
  { path: "/enrollment-v2/contribution", labelKey: "dashboard.stepperContribution" },
  { path: "/enrollment-v2/investment", labelKey: "dashboard.stepperInvestments" },
  { path: "/enrollment-v2/readiness", labelKey: "dashboard.stepperBeneficiaries" },
  { path: "/enrollment-v2/review", labelKey: "dashboard.stepperReview" },
] as const;

export function EnrollmentStepsStrip() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-[var(--color-text)]">
        {t("dashboard.enrollmentStepsTitleFour", "Enrollment takes 4 steps")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SIMPLIFIED_STEPS.map(({ path, labelKey }, index) => (
          <Link
            key={path}
            to={path}
            className="flex flex-col items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm hover:border-[var(--brand-primary)]/40 hover:shadow-md transition-all no-underline text-inherit"
          >
            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[var(--color-background-secondary)] text-[var(--color-textSecondary)] text-sm font-bold">
              {index + 1}
            </div>
            <span className="text-sm font-semibold text-[var(--color-text)] text-center">
              {t(labelKey)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
