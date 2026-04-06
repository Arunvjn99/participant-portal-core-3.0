import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { saveAutoIncreasePreference } from "@/services/enrollmentService";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { getGrowthRate, projectBalanceWithAutoIncrease } from "../flow/readinessMetrics";
import { V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH } from "../flow/v1WizardPaths";
import { useAutoIncreaseFinancialImpact, formatAutoIncreaseCurrency } from "../lib/autoIncreaseShared";
import { AutoIncreaseSkipPanel } from "../components/AutoIncreaseSkipPanel";

const A = "enrollment.v1.autoIncreaseDecision.";

/** Decision-only: two comparison cards + bottom CTAs (Figma: auto-increase.tsx). */
export function AutoIncreaseDecisionScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const [skipPopupOpen, setSkipPopupOpen] = useState(false);

  const currentPercent = data.contribution;
  const growthRate = getGrowthRate(data.riskLevel);
  const yearsToRetirement = Math.max(0, data.retirementAge - data.currentAge);
  const stepPct = Math.max(data.autoIncreaseRate, 1);
  const maxCap = Math.min(Math.max(data.autoIncreaseMax, 10), 15);

  const fixedProjection = data.projectedBalanceNoAutoIncrease;
  const autoProjection = Math.round(
    projectBalanceWithAutoIncrease(
      data.salary,
      data.currentSavings,
      currentPercent,
      yearsToRetirement,
      growthRate,
      stepPct,
      maxCap,
    ),
  );

  const financialImpact = useAutoIncreaseFinancialImpact({
    currentPercent,
    increaseAmount: stepPct,
    maxContribution: maxCap,
    salary: data.salary,
    growthRate,
    currentSavings: data.currentSavings,
    retirementAge: data.retirementAge,
    currentAge: data.currentAge,
  });

  const handleEnableAutoIncrease = () => {
    updateField("autoIncreaseStepResolved", false);
    const r = saveAutoIncreasePreference({ enabled: true, skipped: false });
    if (!r.ok && import.meta.env.DEV) console.warn("[AutoIncreaseDecision] save preference (enable):", r.error);
    navigate(V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH);
  };

  const handleSkipForNow = () => {
    setSkipPopupOpen(true);
  };

  useEffect(() => {
    if (!skipPopupOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSkipPopupOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skipPopupOpen]);

  return (
    <div className="min-w-0 w-full space-y-4">
      <div className="text-left">
        <h1 className="text-2xl font-semibold leading-tight text-[var(--enroll-text-primary)]">{t(`${A}title`)}</h1>
        <p className="mt-1 text-sm leading-snug text-[var(--enroll-text-secondary)]">{t(`${A}subtitle`)}</p>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-background-tertiary)] text-lg leading-none">
              <span aria-hidden>➖</span>
            </div>
            <h3 className="font-semibold text-[var(--enroll-text-primary)]">{t(`${A}cardFixedTitle`)}</h3>
          </div>
          <p className="text-sm text-[var(--enroll-text-secondary)]">{t(`${A}cardFixedDesc`, { percent: currentPercent })}</p>
          <div className="mt-4 flex-1">
            <p className="text-[0.75rem] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
              {t(`${A}projectedRetirement`)}
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--enroll-text-primary)]">${fixedProjection.toLocaleString()}</p>
          </div>
          <button
            type="button"
            onClick={handleSkipForNow}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-background-secondary)]"
          >
            {t(`${A}ctaSkip`)}
          </button>
        </div>

        <div className="relative flex flex-col rounded-xl border-2 border-green-500 bg-[var(--color-surface)] p-5 shadow-sm dark:border-green-600">
          <span className="absolute -top-3 left-4 rounded-full bg-green-600 px-3 py-0.5 text-xs font-semibold text-white dark:bg-green-500">
            {t(`${A}recommended`)}
          </span>
          <div className="mb-3 mt-1 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg leading-none dark:bg-green-950/50">
              <span aria-hidden>📈</span>
            </div>
            <h3 className="font-semibold text-[var(--enroll-text-primary)]">{t(`${A}cardAutoTitle`)}</h3>
          </div>
          <p className="text-sm text-[var(--enroll-text-secondary)]">{t(`${A}cardAutoDesc`)}</p>
          <div className="mt-4 flex-1">
            <p className="text-[0.75rem] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
              {t(`${A}projectedRetirement`)}
            </p>
            <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-400">${autoProjection.toLocaleString()}</p>
          </div>
          <button
            type="button"
            onClick={handleEnableAutoIncrease}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            {t(`${A}ctaEnable`)}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-left md:text-center dark:border-green-900/50 dark:bg-green-950/35">
        <p className="text-sm font-medium leading-snug text-green-800 dark:text-green-100">
          {t(`${A}insightBefore`)}
          <span className="font-bold">{formatAutoIncreaseCurrency(financialImpact.difference)}</span>
          {t(`${A}insightAfter`)}
        </p>
      </div>

      {skipPopupOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auto-increase-skip-popup-title"
          onClick={() => setSkipPopupOpen(false)}
        >
          <div
            className="max-h-[min(90vh,900px)] w-full max-w-[520px] overflow-y-auto rounded-2xl bg-[var(--color-surface)] p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <AutoIncreaseSkipPanel variant="modal" onDismiss={() => setSkipPopupOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
