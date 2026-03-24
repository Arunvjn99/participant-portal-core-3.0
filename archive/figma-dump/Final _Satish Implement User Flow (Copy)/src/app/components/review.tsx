import { useNavigate } from "react-router";
import { useEnrollment } from "./enrollment-context";
import {
  ArrowLeft,
  Edit3,
  Shield,
  DollarSign,
  Briefcase,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function Review() {
  const navigate = useNavigate();
  const { data, updateData, personalization, setCurrentStep } = useEnrollment();

  const yearsToRetirement = personalization.retirementAge - personalization.currentAge;
  const matchPercent = Math.min(data.contributionPercent, 6);
  const annualContribution = Math.round((data.salary * data.contributionPercent) / 100);
  const employerContribution = Math.round((data.salary * matchPercent) / 100);
  const totalAnnual = annualContribution + employerContribution;

  const growthRates: Record<string, number> = {
    conservative: 0.045,
    balanced: 0.068,
    growth: 0.082,
    aggressive: 0.095,
  };
  const growthRate = growthRates[data.riskLevel] || 0.068;

  let projectedBalance = personalization.currentSavings;
  for (let i = 0; i < yearsToRetirement; i++) {
    projectedBalance = (projectedBalance + totalAnnual) * (1 + growthRate);
  }

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  const riskLabels: Record<string, string> = {
    conservative: "Conservative",
    balanced: "Balanced",
    growth: "Growth",
    aggressive: "Aggressive",
  };

  // Build contribution source display
  const sourcesParts: string[] = [];
  if (data.contributionSources.preTax > 0) sourcesParts.push(`Pre-tax ${data.contributionSources.preTax}%`);
  if (data.contributionSources.roth > 0) sourcesParts.push(`Roth ${data.contributionSources.roth}%`);
  if (data.supportsAfterTax && data.contributionSources.afterTax > 0) sourcesParts.push(`After-tax ${data.contributionSources.afterTax}%`);
  const sourcesDisplay = sourcesParts.join(" / ");

  const planSections = [
    {
      label: "Plan",
      value: data.plan === "traditional" ? "Traditional 401(k)" : "Roth 401(k)",
      editStep: 1,
      editPath: "/plan",
    },
    {
      label: "Contribution",
      value: `${data.contributionPercent}% ($${annualContribution.toLocaleString()}/year)`,
      editStep: 2,
      editPath: "/contribution",
    },
    {
      label: "Contribution source",
      value: sourcesDisplay,
      editStep: 3,
      editPath: "/contribution-source",
    },
    {
      label: "Auto increase",
      value: data.autoIncrease
        ? `+${data.autoIncreaseAmount}%/yr up to ${data.autoIncreaseMax}%`
        : "Disabled",
      editStep: 4,
      editPath: "/auto-increase",
    },
    {
      label: "Investment strategy",
      value: `${riskLabels[data.riskLevel]} Portfolio`,
      editStep: 5,
      editPath: "/investment",
    },
  ];

  const handleConfirm = () => {
    navigate("/success");
  };

  // Confidence message
  const confidenceMessage =
    employerContribution >= annualContribution * 0.5
      ? `Your employer contributes $${employerContribution.toLocaleString()} per year to your retirement savings.`
      : `You are on track for retirement at age ${personalization.retirementAge} with your current plan setup.`;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <button
          onClick={() => {
            setCurrentStep(6);
            navigate("/readiness");
          }}
          className="flex items-center gap-1 text-gray-500 mb-3 hover:text-gray-700"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-gray-900">Review Your Retirement Plan</h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.9rem" }}>
          Confirm your selections before enrolling.
        </p>
      </div>

      {/* ── Section 1: Retirement Outcome Hero ── */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <p
          className="text-blue-200"
          style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          Projected retirement balance
        </p>
        <p className="mt-1 tabular-nums" style={{ fontSize: "2.6rem", fontWeight: 700 }}>
          {formatCurrency(projectedBalance)}
        </p>
        <p className="text-blue-200 mt-0.5" style={{ fontSize: "0.75rem" }}>
          Based on your current plan setup over {yearsToRetirement} years. Past results do not guarantee future returns.
        </p>

        {/* Supporting metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3.5 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3 h-3 text-blue-200" />
              <span className="text-blue-200" style={{ fontSize: "0.62rem", fontWeight: 500 }}>
                Your contribution
              </span>
            </div>
            <p style={{ fontSize: "1.05rem", fontWeight: 700 }}>
              ${annualContribution.toLocaleString()}
            </p>
            <p className="text-blue-200" style={{ fontSize: "0.6rem" }}>per year</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3.5 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Briefcase className="w-3 h-3 text-blue-200" />
              <span className="text-blue-200" style={{ fontSize: "0.62rem", fontWeight: 500 }}>
                Employer match
              </span>
            </div>
            <p style={{ fontSize: "1.05rem", fontWeight: 700 }}>
              ${employerContribution.toLocaleString()}
            </p>
            <p className="text-blue-200" style={{ fontSize: "0.6rem" }}>per year</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3.5 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3 h-3 text-blue-200" />
              <span className="text-blue-200" style={{ fontSize: "0.62rem", fontWeight: 500 }}>
                Expected growth
              </span>
            </div>
            <p style={{ fontSize: "1.05rem", fontWeight: 700 }}>
              ~{(growthRate * 100).toFixed(1)}%
            </p>
            <p className="text-blue-200" style={{ fontSize: "0.6rem" }}>
              annual ({riskLabels[data.riskLevel].toLowerCase()})
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3.5 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3 h-3 text-blue-200" />
              <span className="text-blue-200" style={{ fontSize: "0.62rem", fontWeight: 500 }}>
                Time horizon
              </span>
            </div>
            <p style={{ fontSize: "1.05rem", fontWeight: 700 }}>
              {yearsToRetirement} years
            </p>
            <p className="text-blue-200" style={{ fontSize: "0.6rem" }}>
              retire at age {personalization.retirementAge}
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 2: Plan Summary Grid ── */}
      <div>
        <p className="text-gray-900 mb-3" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
          Your Plan Setup
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {planSections.map((section) => (
            <div
              key={section.label}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 flex flex-col justify-between group"
            >
              <div>
                <p
                  className="text-gray-400"
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {section.label}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                  {section.value}
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentStep(section.editStep);
                  navigate(section.editPath);
                }}
                className="flex items-center gap-1 text-blue-600 mt-2.5 hover:text-blue-700 transition-colors self-start"
                style={{ fontSize: "0.7rem", fontWeight: 500 }}
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Confidence Reinforcement ── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-amber-800" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
          {confidenceMessage}
        </p>
      </div>

      {/* ── Section 4: Final Confirmation ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="mt-0.5">
            <input
              type="checkbox"
              checked={data.agreedToTerms}
              onChange={(e) => updateData({ agreedToTerms: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 accent-blue-600"
            />
          </div>
          <span className="text-gray-700" style={{ fontSize: "0.82rem" }}>
            I confirm my retirement plan enrollment and understand my contributions will begin next
            pay period.{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5"
              style={{ fontWeight: 500 }}
            >
              View full plan terms <ExternalLink className="w-3 h-3" />
            </a>
          </span>
        </label>
      </div>

      {/* ── Primary Action ── */}
      <div className="sticky bottom-4 md:static">
        <button
          onClick={handleConfirm}
          disabled={!data.agreedToTerms}
          className={`w-full py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg md:shadow-none ${
            data.agreedToTerms
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Shield className="w-4 h-4" /> Enroll in Retirement Plan
        </button>
      </div>
    </div>
  );
}
