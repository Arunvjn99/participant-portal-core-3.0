import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Briefcase,
  Clock,
  DollarSign,
  Edit3,
  ExternalLink,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { pathForWizardStep } from "../flow/v1WizardPaths";
import type { RiskLevel } from "../store/useEnrollmentStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
const R = "enrollment.v1.review.";
const INV = "enrollment.v1.investment.";

function riskLabelKey(rl: RiskLevel): string {
  const m: Record<RiskLevel, string> = {
    conservative: "riskConservative",
    balanced: "riskBalanced",
    growth: "riskGrowth",
    aggressive: "riskAggressive",
  };
  return `${INV}${m[rl]}`;
}

export function Review() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const goToStep = useEnrollmentStore((s) => s.goToStep);

  const yearsToRetirement = data.retirementAge - data.currentAge;
  const annualContribution = Math.round(data.monthlyContribution * 12);
  const employerContribution = Math.round(data.employerMatch * 12);

  const growthRates: Record<RiskLevel, number> = {
    conservative: 0.045,
    balanced: 0.068,
    growth: 0.082,
    aggressive: 0.095,
  };
  const rl = data.riskLevel ?? "balanced";
  const growthRate = growthRates[rl] ?? 0.068;

  const projectedBalance = data.projectedBalance;

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  const sourcesParts: string[] = [];
  if (data.contributionSources.preTax > 0) {
    sourcesParts.push(t(`${R}sourcePreTax`, { pct: data.contributionSources.preTax }));
  }
  if (data.contributionSources.roth > 0) {
    sourcesParts.push(t(`${R}sourceRoth`, { pct: data.contributionSources.roth }));
  }
  if (data.supportsAfterTax && data.contributionSources.afterTax > 0) {
    sourcesParts.push(t(`${R}sourceAfterTax`, { pct: data.contributionSources.afterTax }));
  }
  const sourcesDisplay = sourcesParts.join(" / ") || t(`${R}placeholder`);

  const planSections: { label: string; value: string; editIndex: number }[] = [
    {
      label: t(`${R}rowPlan`),
      value: data.selectedPlan === "traditional" ? t(`${R}planTraditional`) : t(`${R}planRoth`),
      editIndex: 0,
    },
    {
      label: t(`${R}rowContribution`),
      value: `${data.contribution}% ($${annualContribution.toLocaleString()}/${t(`${R}perYear`)})`,
      editIndex: 1,
    },
    {
      label: t(`${R}rowContributionSource`),
      value: sourcesDisplay,
      editIndex: 2,
    },
    {
      label: t(`${R}rowAutoIncrease`),
      value: data.autoIncrease
        ? t(`${R}autoIncreaseOnDetail`, { rate: data.autoIncreaseRate, max: data.autoIncreaseMax })
        : t(`${R}autoIncreaseOff`),
      editIndex: 3,
    },
    {
      label: t(`${R}rowInvestmentStrategy`),
      value: t(`${R}strategyPortfolioPhrase`, { strategy: t(riskLabelKey(rl)) }),
      editIndex: 4,
    },
  ];

  const jumpTo = (stepIndex: number) => {
    goToStep(stepIndex);
    navigate(pathForWizardStep(stepIndex));
  };

  const confidenceMessage =
    employerContribution >= annualContribution * 0.5
      ? t(`${R}confidenceEmployer`, { amount: employerContribution.toLocaleString() })
      : t(`${R}confidenceOnTrack`, { age: data.retirementAge });

  return (
    <div className="w-full min-w-0 space-y-4 text-left">
      <div>
        <h1 className="text-2xl font-semibold leading-tight text-foreground">{t(`${R}pageTitle`)}</h1>
        <p className="mt-1 text-sm leading-snug text-muted-foreground">{t(`${R}pageSubtitle`)}</p>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] p-5 text-white shadow-md">
        <p className="text-[0.7rem] font-medium uppercase tracking-wider text-white/70">
          {t(`${R}heroProjectedLabel`)}
        </p>
        <p className="mt-0.5 text-3xl font-bold tabular-nums leading-tight tracking-tight sm:text-[2rem]">
          {formatCurrency(projectedBalance)}
        </p>
        <p className="mt-1 text-xs leading-snug text-white/70">
          {t(`${R}heroDisclaimer`, { years: yearsToRetirement })}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          <ReviewHeroMetric
            icon={<DollarSign className="h-3 w-3 text-white/70" aria-hidden />}
            label={t(`${R}metricYourContribution`)}
            value={`$${annualContribution.toLocaleString()}`}
            sub={t(`${R}perYear`)}
          />
          <ReviewHeroMetric
            icon={<Briefcase className="h-3 w-3 text-white/70" aria-hidden />}
            label={t(`${R}metricEmployerMatch`)}
            value={`$${employerContribution.toLocaleString()}`}
            sub={t(`${R}perYear`)}
          />
          <ReviewHeroMetric
            icon={<TrendingUp className="h-3 w-3 text-white/70" aria-hidden />}
            label={t(`${R}metricExpectedGrowth`)}
            value={`~${(growthRate * 100).toFixed(1)}%`}
            sub={t(`${R}annualGrowthSub`, { risk: t(riskLabelKey(rl)).toLowerCase() })}
          />
          <ReviewHeroMetric
            icon={<Clock className="h-3 w-3 text-white/70" aria-hidden />}
            label={t(`${R}metricTimeHorizon`)}
            value={t(`${R}yearsCount`, { count: yearsToRetirement })}
            sub={t(`${R}retireAtAge`, { age: data.retirementAge })}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">{t(`${R}planSetupTitle`)}</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {planSections.map((section) => (
            <div key={section.label} className="card-setup-compact flex flex-col justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.label}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{section.value}</p>
              </div>
              <button
                type="button"
                onClick={() => jumpTo(section.editIndex)}
                className="mt-2.5 flex items-center gap-1 self-start text-xs font-medium text-primary hover:underline"
              >
                <Edit3 className="h-3 w-3" aria-hidden />
                {t(`${R}edit`)}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="warning-callout">
        <Sparkles className="warning-callout__icon mt-0.5 h-4 w-4" aria-hidden />
        <p className="warning-callout__text">{confidenceMessage}</p>
      </div>

      <div className="card-setup-compact">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={data.agreedToTerms}
            onChange={(e) => updateField("agreedToTerms", e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-border accent-primary"
          />
          <span className="text-sm text-foreground/90">
            {t(`${R}termsConfirm`)}{" "}
            <span className="inline-flex items-center gap-0.5 font-medium text-primary">
              {t(`${R}viewPlanTerms`)} <ExternalLink className="h-3 w-3" aria-hidden />
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}

function ReviewHeroMetric({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 px-3.5 py-3 backdrop-blur-sm">
      <div className="mb-1 flex items-center gap-1.5">
        {icon}
        <span className="text-[0.62rem] font-medium text-white/70">{label}</span>
      </div>
      <p className="text-[1.05rem] font-bold tabular-nums">{value}</p>
      <p className="text-[0.6rem] text-white/70">{sub}</p>
    </div>
  );
}
