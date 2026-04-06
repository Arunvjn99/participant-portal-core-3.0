import type { ReactNode } from "react";
import { useCallback } from "react";
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
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { pathForWizardStep } from "@/modules/enrollment/v1/flow/v1WizardPaths";
import { getGrowthRate } from "../utils/calculations";

const R = "enrollment.v1.review.";

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
  return `$${Math.round(val).toLocaleString()}`;
}

export function ReviewStep() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const store = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const goToStep = useEnrollmentStore((s) => s.goToStep);

  const {
    selectedPlan,
    contribution,
    contributionSources,
    autoIncrease,
    autoIncreaseRate,
    autoIncreaseMax,
    riskLevel,
    projectedBalance,
    retirementProjection,
    monthlyContribution,
    employerMatch,
    agreedToTerms,
    retirementAge,
    currentAge,
    supportsAfterTax,
  } = store;

  const yearsToRetirement = retirementAge - currentAge;
  const annualContribution = Math.round(monthlyContribution * 12);
  const employerContribution = Math.round(employerMatch * 12);
  const rl = riskLevel ?? "balanced";
  const growthRate = getGrowthRate(rl);

  const sourcesParts: string[] = [];
  if (contributionSources.preTax > 0)
    sourcesParts.push(`Pre-Tax ${contributionSources.preTax}%`);
  if (contributionSources.roth > 0)
    sourcesParts.push(`Roth ${contributionSources.roth}%`);
  if (supportsAfterTax && contributionSources.afterTax > 0)
    sourcesParts.push(`After-Tax ${contributionSources.afterTax}%`);
  const sourcesDisplay = sourcesParts.join(" / ") || "—";

  const planSections = [
    {
      label: "Plan Type",
      value:
        selectedPlan === "traditional"
          ? "Traditional 401(k)"
          : "Roth 401(k)",
      editStep: 0,
    },
    {
      label: "Contribution",
      value: `${contribution}% ($${annualContribution.toLocaleString()}/yr)`,
      editStep: 1,
    },
    {
      label: "Source Split",
      value: sourcesDisplay,
      editStep: 2,
    },
    {
      label: "Auto-Increase",
      value: autoIncrease
        ? `+${autoIncreaseRate}%/yr up to ${autoIncreaseMax}%`
        : "Not enabled",
      editStep: 3,
    },
    {
      label: "Investment Strategy",
      value: rl ? rl.charAt(0).toUpperCase() + rl.slice(1) : "—",
      editStep: 4,
    },
  ];

  const jumpTo = useCallback(
    (stepIndex: number) => {
      goToStep(stepIndex);
      navigate(pathForWizardStep(stepIndex));
    },
    [goToStep, navigate],
  );

  const confidenceMessage =
    employerContribution >= annualContribution * 0.5
      ? `Your employer is contributing $${employerContribution.toLocaleString()}/year — that's free money working for you.`
      : `You're on track to retire at age ${retirementAge} with a solid foundation.`;

  return (
    <div className="ew-step" style={{ gap: "1rem" }}>
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-semibold leading-tight"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {t(`${R}pageTitle`, "Review & Submit")}
        </h1>
        <p
          className="mt-1 text-sm leading-snug"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          {t(
            `${R}pageSubtitle`,
            "Review your enrollment selections before submitting.",
          )}
        </p>
      </div>

      {/* Hero card with gradient */}
      <div
        className="rounded-xl p-5 text-white shadow-md"
        style={{
          background:
            "linear-gradient(135deg, var(--enroll-brand), color-mix(in srgb, var(--enroll-brand) 70%, #4338ca))",
        }}
      >
        <p className="text-[0.7rem] font-medium uppercase tracking-wider opacity-80">
          Projected Retirement Balance
        </p>
        <p className="mt-0.5 text-3xl font-bold tabular-nums leading-tight tracking-tight sm:text-[2rem]">
          {formatCurrency(projectedBalance)}
        </p>
        <p className="mt-1 text-xs leading-snug opacity-70">
          Estimated over {yearsToRetirement} years based on current selections
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          <HeroMetric
            icon={<DollarSign className="h-3 w-3 opacity-70" aria-hidden />}
            label="Your Contribution"
            value={`$${annualContribution.toLocaleString()}`}
            sub="/year"
          />
          <HeroMetric
            icon={<Briefcase className="h-3 w-3 opacity-70" aria-hidden />}
            label="Employer Match"
            value={`$${employerContribution.toLocaleString()}`}
            sub="/year"
          />
          <HeroMetric
            icon={<TrendingUp className="h-3 w-3 opacity-70" aria-hidden />}
            label="Expected Growth"
            value={`~${(growthRate * 100).toFixed(1)}%`}
            sub={`${rl} strategy`}
          />
          <HeroMetric
            icon={<Clock className="h-3 w-3 opacity-70" aria-hidden />}
            label="Time Horizon"
            value={`${yearsToRetirement} years`}
            sub={`Retire at ${retirementAge}`}
          />
        </div>
      </div>

      {/* Plan setup cards */}
      <div>
        <p
          className="mb-2 text-sm font-semibold"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          Your Plan Setup
        </p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {planSections.map((section) => (
            <div
              key={section.label}
              className="flex flex-col justify-between rounded-xl border p-4"
              style={{
                borderColor: "var(--enroll-card-border)",
                background: "var(--enroll-card-bg)",
              }}
            >
              <div>
                <p
                  className="text-[0.65rem] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--enroll-text-muted)" }}
                >
                  {section.label}
                </p>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  {section.value}
                </p>
              </div>
              <button
                type="button"
                onClick={() => jumpTo(section.editStep)}
                className="mt-2.5 flex items-center gap-1 self-start text-xs font-medium hover:underline"
                style={{ color: "var(--enroll-brand)" }}
              >
                <Edit3 className="h-3 w-3" aria-hidden />
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence callout */}
      <div
        className="flex items-start gap-2.5 rounded-xl border px-4 py-3.5"
        style={{
          borderColor:
            "color-mix(in srgb, var(--ai-primary) 20%, transparent)",
          background:
            "color-mix(in srgb, var(--ai-primary) 6%, var(--enroll-card-bg))",
        }}
      >
        <Sparkles
          className="mt-0.5 h-4 w-4 shrink-0"
          style={{ color: "var(--ai-primary)" }}
          aria-hidden
        />
        <p
          className="text-sm leading-snug"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          {confidenceMessage}
        </p>
      </div>

      {/* Terms checkbox */}
      <div
        className="rounded-xl border p-4"
        style={{
          borderColor: "var(--enroll-card-border)",
          background: "var(--enroll-card-bg)",
        }}
      >
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => updateField("agreedToTerms", e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded"
            style={{ accentColor: "var(--enroll-brand)" }}
          />
          <span
            className="text-sm"
            style={{ color: "var(--enroll-text-secondary)" }}
          >
            I have reviewed my enrollment selections and agree to the plan terms
            and conditions.{" "}
            <span
              className="inline-flex items-center gap-0.5 font-medium"
              style={{ color: "var(--enroll-brand)" }}
            >
              View plan terms{" "}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}

function HeroMetric({
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
    <div className="rounded-xl px-3.5 py-3 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.1)" }}>
      <div className="mb-1 flex items-center gap-1.5">
        {icon}
        <span className="text-[0.62rem] font-medium opacity-70">{label}</span>
      </div>
      <p className="text-[1.05rem] font-bold tabular-nums">{value}</p>
      <p className="text-[0.6rem] opacity-70">{sub}</p>
    </div>
  );
}
