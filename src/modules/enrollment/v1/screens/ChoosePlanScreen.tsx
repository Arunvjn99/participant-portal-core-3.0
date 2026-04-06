import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  Landmark,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { pathForWizardStep } from "../flow/v1WizardPaths";
import type { SelectedPlanOption } from "../store/useEnrollmentStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";

const P = "enrollment.v1.plan.";

type CompareRow = { feature: string; traditional: string; roth: string };

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

function asCompareRows(v: unknown): CompareRow[] {
  if (!Array.isArray(v)) return [];
  return v.filter((r): r is CompareRow => r != null && typeof r === "object" && "feature" in r) as CompareRow[];
}

/** Single-plan fallback card. */
const planCardBase =
  "flex min-w-0 flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-left " +
  "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)]";

const ctaSinglePrimary =
  "flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-xl " +
  "bg-[var(--color-primary)] px-4 text-sm font-semibold text-white " +
  "shadow-sm transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-md active:scale-[0.99]";

function ChoosePlanScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { updateField, nextStep } = useEnrollmentStore();
  const selectedPlan = useEnrollmentStore((s) => s.selectedPlan);

  const [showAI, setShowAI] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const traditionalBenefits = useMemo(
    () => asStringArray(t(`${P}traditionalBenefits`, { returnObjects: true })),
    [t],
  );
  const rothBenefits = useMemo(() => asStringArray(t(`${P}rothBenefits`, { returnObjects: true })), [t]);
  const compareRows = useMemo(() => asCompareRows(t(`${P}compareRows`, { returnObjects: true })), [t]);

  const companyPlans = useEnrollmentStore((s) => s.companyPlans);
  const hasTwoPlans = companyPlans.length >= 2;

  const goWithPlan = (plan: SelectedPlanOption) => {
    updateField("selectedPlan", plan);
    nextStep();
    navigate(pathForWizardStep(1));
  };

  if (!hasTwoPlans) {
    const onlyPlan = companyPlans[0] || "traditional";
    const planLabel =
      onlyPlan === "traditional" ? t(`${P}traditionalTitle`) : t(`${P}rothTitle`);

    return (
      <div className="min-w-0 w-full space-y-4">
        <div className={`${planCardBase} w-full min-w-0`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]">
            <Landmark className="h-5 w-5 text-[var(--color-primary)]" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold leading-tight text-[var(--enroll-text-primary)]">{t(`${P}singlePlanTitle`, { planLabel })}</h2>
            <p className="mt-1 text-sm leading-snug text-[var(--enroll-text-secondary)]">
              {onlyPlan === "traditional" ? t(`${P}singleTraditionalExplainer`) : t(`${P}singleRothExplainer`)}
            </p>
          </div>

          <button type="button" onClick={() => goWithPlan(onlyPlan)} className={ctaSinglePrimary}>
            {t(`${P}ctaContinueSingle`)} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full space-y-5">
      {/* Header */}
      <div className="text-left">
        <h1 className="text-xl font-semibold leading-tight text-[var(--enroll-text-primary)]">{t(`${P}title`)}</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--enroll-text-secondary)]">{t(`${P}subtitle`)}</p>
      </div>

      {/* Plan selection cards — clicking anywhere selects the plan */}
      <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">

        {/* Traditional */}
        <button
          type="button"
          role="radio"
          aria-checked={selectedPlan === "traditional"}
          aria-label={t(`${P}selectPlanAria`, { plan: t(`${P}traditionalTitle`) })}
          onClick={() => updateField("selectedPlan", "traditional")}
          className={cn(
            "flex min-w-0 flex-col rounded-2xl border bg-[var(--color-surface)] p-6 text-left",
            "transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
            selectedPlan === "traditional"
              ? "border-2 border-[var(--color-primary)] shadow-[0_4px_20px_rgb(var(--color-primary-rgb)/0.15)] ring-4 ring-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]"
              : "border-[var(--color-border)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)] hover:border-[var(--color-border)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:-translate-y-[1px]",
          )}
        >
          {/* Badge row */}
          <div className="mb-4 flex min-w-0 items-start justify-between gap-2">
            <div className="relative min-w-0">
              <span
                className="inline-flex max-w-full min-w-0 items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span className="min-w-0 break-words">{t(`${P}badgeMostCommon`)}</span>
                <HelpCircle className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
              </span>
              {showTooltip ? (
                <div
                  className="absolute left-0 top-full z-10 mt-1 max-w-xs rounded-lg bg-[var(--color-background)] px-3 py-2 text-xs leading-snug text-[var(--color-text)] shadow-lg"
                  role="tooltip"
                >
                  {t(`${P}badgeTooltip`)}
                  <div className="absolute left-6 top-0 h-2 w-2 -translate-y-1/2 rotate-45 bg-[var(--color-background)]" />
                </div>
              ) : null}
            </div>
            {selectedPlan === "traditional" && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                {t(`${P}selectedLabel`)}
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-[var(--enroll-text-primary)]">{t(`${P}traditionalTitle`)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--enroll-text-secondary)]">{t(`${P}traditionalDesc`)}</p>

          <ul className="mt-4 flex min-w-0 flex-col gap-2">
            {traditionalBenefits.map((b) => (
              <li key={b} className="flex min-w-0 items-start gap-2 text-sm leading-snug text-[var(--enroll-text-secondary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        </button>

        {/* Roth */}
        <button
          type="button"
          role="radio"
          aria-checked={selectedPlan === "roth"}
          aria-label={t(`${P}selectPlanAria`, { plan: t(`${P}rothTitle`) })}
          onClick={() => updateField("selectedPlan", "roth")}
          className={cn(
            "flex min-w-0 flex-col rounded-2xl border bg-[var(--color-surface)] p-6 text-left",
            "transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
            selectedPlan === "roth"
              ? "border-2 border-[var(--color-primary)] shadow-[0_4px_20px_rgb(var(--color-primary-rgb)/0.15)] ring-4 ring-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]"
              : "border-[var(--color-border)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)] hover:border-[var(--color-border)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:-translate-y-[1px]",
          )}
        >
          {/* Selected indicator (right-aligned) */}
          {selectedPlan === "roth" && (
            <div className="mb-4 flex justify-end">
              <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                {t(`${P}selectedLabel`)}
              </span>
            </div>
          )}

          <h3 className="text-base font-semibold text-[var(--enroll-text-primary)]">{t(`${P}rothTitle`)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--enroll-text-secondary)]">{t(`${P}rothDesc`)}</p>

          <ul className="mt-4 flex min-w-0 flex-col gap-2">
            {rothBenefits.map((b) => (
              <li key={b} className="flex min-w-0 items-start gap-2 text-sm leading-snug text-[var(--enroll-text-secondary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        </button>
      </div>

      {/* "Not sure?" helper — secondary, ghost-style buttons only */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)]">
        <p className="text-sm font-semibold text-[var(--enroll-text-primary)]">{t(`${P}notSureTitle`)}</p>
        <p className="mt-1 text-sm leading-snug text-[var(--enroll-text-secondary)]">{t(`${P}notSureSubtitle`)}</p>
        <div className="mt-3 flex min-w-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setShowAI(!showAI); setShowCompare(false); }}
            className={cn(
              "flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
              showAI
                ? "border-violet-400/90 bg-violet-100/90 text-violet-900 shadow-sm dark:border-violet-600 dark:bg-violet-950/60 dark:text-violet-100"
                : "border-violet-200/80 bg-violet-50/50 text-violet-800 hover:border-violet-300 hover:bg-violet-50 dark:border-violet-800/50 dark:bg-violet-950/30 dark:text-violet-200 dark:hover:border-violet-700 dark:hover:bg-violet-950/45",
            )}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden /> {t(`${P}askAi`)}
          </button>
          <button
            type="button"
            onClick={() => { setShowCompare(!showCompare); setShowAI(false); }}
            className={cn(
              "flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
              showCompare
                ? "border-[var(--color-border)] bg-[var(--color-background-tertiary)] text-[var(--color-text)]"
                : "border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:border-[var(--color-border)]",
            )}
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden /> {t(`${P}comparePlans`)}
          </button>
        </div>

        {showAI ? (
          <div className="mt-3 min-w-0 rounded-xl border border-purple-100 bg-purple-50 p-3 dark:border-purple-900/50 dark:bg-purple-950/35">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden />
              <div className="text-sm leading-snug">
                <p className="font-semibold text-purple-900 dark:text-purple-100">{t(`${P}aiRecommendationTitle`)}</p>
                <p className="mt-1 text-purple-800 dark:text-purple-200/95">
                  <Trans
                    i18nKey={`${P}aiRecommendationBody`}
                    components={{ trad: <strong />, roth: <strong /> }}
                  />
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {showCompare ? (
          <div className="mt-3 min-w-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="py-2 text-left text-[var(--enroll-text-secondary)]" style={{ fontWeight: 500 }}>
                    {t(`${P}compareColFeature`)}
                  </th>
                  <th className="py-2 text-left text-[var(--enroll-text-primary)]" style={{ fontWeight: 600 }}>
                    {t(`${P}compareColTraditional`)}
                  </th>
                  <th className="py-2 text-left text-[var(--enroll-text-primary)]" style={{ fontWeight: 600 }}>
                    {t(`${P}compareColRoth`)}
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--enroll-text-secondary)]">
                {compareRows.map((row) => (
                  <tr key={row.feature} className="border-b border-[var(--color-border)]">
                    <td className="py-2 text-[var(--enroll-text-secondary)]">{row.feature}</td>
                    <td className="py-2">{row.traditional}</td>
                    <td className="py-2">{row.roth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ChoosePlanScreen;
