import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
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

const RISK_LABELS: Record<RiskLevel, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  growth: "Growth",
  aggressive: "Aggressive",
};

export function Review() {
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const goToStep = useEnrollmentStore((s) => s.goToStep);

  const yearsToRetirement = data.retirementAge - data.currentAge;
  const matchPercent = Math.min(data.contribution, 6);
  const annualContribution = Math.round((data.salary * data.contribution) / 100);
  const employerContribution = Math.round((data.salary * matchPercent) / 100);
  const totalAnnual = annualContribution + employerContribution;

  const growthRates: Record<RiskLevel, number> = {
    conservative: 0.045,
    balanced: 0.068,
    growth: 0.082,
    aggressive: 0.095,
  };
  const rl = data.riskLevel ?? "balanced";
  const growthRate = growthRates[rl] ?? 0.068;

  let projectedBalance = data.currentSavings;
  for (let i = 0; i < yearsToRetirement; i++) {
    projectedBalance = (projectedBalance + totalAnnual) * (1 + growthRate);
  }

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  const sourcesParts: string[] = [];
  if (data.contributionSources.preTax > 0) {
    sourcesParts.push(`Pre-tax ${data.contributionSources.preTax}%`);
  }
  if (data.contributionSources.roth > 0) {
    sourcesParts.push(`Roth ${data.contributionSources.roth}%`);
  }
  if (data.supportsAfterTax && data.contributionSources.afterTax > 0) {
    sourcesParts.push(`After-tax ${data.contributionSources.afterTax}%`);
  }
  const sourcesDisplay = sourcesParts.join(" / ") || "—";

  const planSections: { label: string; value: string; editIndex: number }[] = [
    {
      label: "Plan",
      value: data.selectedPlan === "traditional" ? "Traditional 401(k)" : "Roth 401(k)",
      editIndex: 0,
    },
    {
      label: "Contribution",
      value: `${data.contribution}% ($${annualContribution.toLocaleString()}/year)`,
      editIndex: 1,
    },
    {
      label: "Contribution source",
      value: sourcesDisplay,
      editIndex: 2,
    },
    {
      label: "Auto increase",
      value: data.autoIncrease
        ? `+${data.autoIncreaseRate}%/yr up to ${data.autoIncreaseMax}%`
        : "Disabled",
      editIndex: 3,
    },
    {
      label: "Investment strategy",
      value: `${RISK_LABELS[rl]} portfolio`,
      editIndex: 4,
    },
  ];

  const jumpTo = (stepIndex: number) => {
    goToStep(stepIndex);
    navigate(pathForWizardStep(stepIndex));
  };

  const confidenceMessage =
    employerContribution >= annualContribution * 0.5
      ? `Your employer contributes $${employerContribution.toLocaleString()} per year to your retirement savings.`
      : `You are on track for retirement at age ${data.retirementAge} with your current plan setup.`;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">Review Your Retirement Plan</h1>
        <p className="mt-1 text-sm text-muted-foreground">Confirm your selections before enrolling.</p>
      </div>

      <div className="review-hero">
        <p className="review-hero__muted--caps">Projected retirement balance</p>
        <p className="mt-1 text-4xl font-bold tabular-nums">{formatCurrency(projectedBalance)}</p>
        <p className="review-hero__muted mt-0.5">
          Based on your current plan setup over {yearsToRetirement} years. Past results do not guarantee future
          returns.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric
            icon={<DollarSign className="review-hero__icon h-3 w-3" aria-hidden />}
            label="Your contribution"
            value={`$${annualContribution.toLocaleString()}`}
            sub="per year"
          />
          <Metric
            icon={<Briefcase className="review-hero__icon h-3 w-3" aria-hidden />}
            label="Employer match"
            value={`$${employerContribution.toLocaleString()}`}
            sub="per year"
          />
          <Metric
            icon={<TrendingUp className="review-hero__icon h-3 w-3" aria-hidden />}
            label="Expected growth"
            value={`~${(growthRate * 100).toFixed(1)}%`}
            sub={`annual (${RISK_LABELS[rl].toLowerCase()})`}
          />
          <Metric
            icon={<Clock className="review-hero__icon h-3 w-3" aria-hidden />}
            label="Time horizon"
            value={`${yearsToRetirement} years`}
            sub={`retire at age ${data.retirementAge}`}
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Your Plan Setup</p>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
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
                Edit
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
            I confirm my retirement plan enrollment and understand my contributions will begin next pay period.{" "}
            <span className="inline-flex items-center gap-0.5 font-medium text-primary">
              View full plan terms <ExternalLink className="h-3 w-3" aria-hidden />
            </span>
          </span>
        </label>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        When ready, tap <strong>Finish</strong> below to complete enrollment.
      </p>
    </div>
  );
}

function Metric({
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
    <div className="review-hero__metric">
      <div className="mb-1 flex items-center gap-1.5">
        {icon}
        <span className="review-hero__metric-label">{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
      <p className="review-hero__muted">{sub}</p>
    </div>
  );
}
