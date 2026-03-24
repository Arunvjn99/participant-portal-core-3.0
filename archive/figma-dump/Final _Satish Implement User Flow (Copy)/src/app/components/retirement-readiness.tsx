import { useNavigate } from "react-router";
import { useEnrollment } from "./enrollment-context";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  X,
  Percent,
  ChevronRight,
  Award,
  AlertTriangle,
  Info,
  Clock,
  Target,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* ─── Types ─── */

interface Suggestion {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  scoreIncrease: number;
  newScore: number;
  additionalAnnualSavings: number;
  projectedBalance: number;
  currentLabel: string;
  currentValue: string;
  newLabel: string;
  newValue: string;
  apply: () => void;
}

/* ─── Animated Counter ─── */

function AnimatedScore({
  value,
  color,
  circumference,
}: {
  value: number;
  color: string;
  circumference: number;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const [animating, setAnimating] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setAnimating(true);
      const start = prevValue.current;
      const diff = value - start;
      const duration = 800;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(start + diff * eased));
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimating(false);
        }
      };
      requestAnimationFrame(animate);
      prevValue.current = value;
    }
  }, [value]);

  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: animating ? "none" : "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-gray-900 tabular-nums"
          style={{ fontSize: "2.8rem", fontWeight: 700 }}
        >
          {displayValue}
        </span>
        <span className="text-gray-400" style={{ fontSize: "0.75rem" }}>
          out of 100
        </span>
      </div>
    </div>
  );
}

/* ─── Confirmation Modal ─── */

function ConfirmationModal({
  isOpen,
  suggestion,
  currentScore,
  currentBalance,
  formatCurrency,
  onCancel,
  onApply,
}: {
  isOpen: boolean;
  suggestion: Suggestion | null;
  currentScore: number;
  currentBalance: number;
  formatCurrency: (val: number) => string;
  onCancel: () => void;
  onApply: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !suggestion) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onCancel();
  };

  const scoreDiff = suggestion.newScore - currentScore;
  const balanceDiff = suggestion.projectedBalance - currentBalance;
  const newScoreColor =
    suggestion.newScore >= 60 ? "text-green-600" : suggestion.newScore >= 40 ? "text-amber-600" : "text-red-500";

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-gray-900" style={{ fontSize: "1rem", fontWeight: 600 }}>
              Confirm Change
            </p>
            <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.75rem" }}>
              Review the impact before applying.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* What's changing */}
          <div>
            <p
              className="text-gray-400 mb-3"
              style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              What&apos;s changing
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-gray-400" style={{ fontSize: "0.68rem", fontWeight: 500 }}>
                  {suggestion.currentLabel}
                </p>
                <p className="text-gray-900 mt-0.5" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  {suggestion.currentValue}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                <p className="text-blue-500" style={{ fontSize: "0.68rem", fontWeight: 500 }}>
                  {suggestion.newLabel}
                </p>
                <p className="text-blue-700 mt-0.5" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  {suggestion.newValue}
                </p>
              </div>
            </div>
          </div>

          {/* Impact metrics */}
          <div>
            <p
              className="text-gray-400 mb-3"
              style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              Impact
            </p>
            <div className="space-y-3">
              {/* Readiness score */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-gray-600" style={{ fontSize: "0.82rem" }}>
                  Readiness score
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 tabular-nums" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                    {currentScore}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                  <span className={`tabular-nums ${newScoreColor}`} style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                    {suggestion.newScore}
                  </span>
                  <span
                    className="text-green-600 flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded"
                    style={{ fontSize: "0.68rem", fontWeight: 600 }}
                  >
                    <ArrowUpRight className="w-2.5 h-2.5" />+{scoreDiff}
                  </span>
                </div>
              </div>

              {/* Additional savings */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-gray-600" style={{ fontSize: "0.82rem" }}>
                  Additional annual savings
                </span>
                <span className="text-green-700 tabular-nums" style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                  +${suggestion.additionalAnnualSavings.toLocaleString()}
                </span>
              </div>

              {/* Projected balance */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-gray-600" style={{ fontSize: "0.82rem" }}>
                  Projected retirement balance
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 tabular-nums" style={{ fontSize: "0.82rem" }}>
                    {formatCurrency(currentBalance)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                  <span className="text-gray-900 tabular-nums" style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                    {formatCurrency(suggestion.projectedBalance)}
                  </span>
                </div>
              </div>

              {/* Balance increase callout */}
              {balanceDiff > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-center">
                  <span className="text-green-700" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                    +{formatCurrency(balanceDiff)} more at retirement
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            style={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all"
            style={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            <Zap className="w-3.5 h-3.5" /> Apply Change
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export function RetirementReadiness() {
  const navigate = useNavigate();
  const { data, updateData, personalization, setCurrentStep } = useEnrollment();
  const [appliedChanges, setAppliedChanges] = useState<string[]>([]);
  const [confirmingSuggestion, setConfirmingSuggestion] = useState<Suggestion | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const yearsToRetirement = personalization.retirementAge - personalization.currentAge;

  // Score calculation
  const computeScore = (contribPct: number, autoInc: boolean, riskLevel: string) => {
    const contribScore = contribPct * 5;
    const autoIncScore = autoInc ? 12 : 0;
    const timeScore = Math.min(yearsToRetirement * 0.8, 20);
    const savingsBonus = Math.min(personalization.currentSavings / 10000, 10);
    const riskBonus = riskLevel === "growth" ? 3 : riskLevel === "aggressive" ? 5 : 0;
    return Math.min(Math.round(contribScore + autoIncScore + timeScore + savingsBonus + riskBonus), 100);
  };

  const score = computeScore(data.contributionPercent, data.autoIncrease, data.riskLevel);

  // Projections
  const matchPercent = Math.min(data.contributionPercent, 6);
  const annualContribution = Math.round((data.salary * data.contributionPercent) / 100);
  const employerContribution = Math.round((data.salary * matchPercent) / 100);
  
  // Calculate retirement income goal (simplified: 80% of current salary)
  const retirementIncomeGoal = Math.round(data.salary * 0.8);
  const annualSavingsGap = Math.max(0, retirementIncomeGoal - annualContribution - employerContribution);
  
  const growthRates: Record<string, number> = {
    conservative: 0.045,
    balanced: 0.068,
    growth: 0.082,
    aggressive: 0.095,
  };
  const growthRate = growthRates[data.riskLevel] || 0.068;

  const computeProjectedBalance = (
    annualContrib: number,
    employerContrib: number,
    years: number,
    rate: number,
    startingSavings?: number
  ) => {
    let balance = startingSavings ?? personalization.currentSavings;
    for (let i = 0; i < years; i++) {
      balance = (balance + annualContrib + employerContrib) * (1 + rate);
    }
    return balance;
  };

  const projectedBalance = computeProjectedBalance(
    annualContribution,
    employerContribution,
    yearsToRetirement,
    growthRate
  );

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  // Score color
  const circumference = 2 * Math.PI * 70;
  const scoreColor = score >= 60 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";

  const getMessage = () => {
    if (score >= 80) return "You're on a great track!";
    if (score >= 60) return "You're building a solid foundation.";
    if (score >= 40) return "You're getting started — keep going!";
    return "Every step counts toward your goal.";
  };

  // ── Build improvement suggestions ──

  const suggestions: Suggestion[] = [];

  // 1. Increase contribution by 2%
  const boostPct = 2;
  const boostedContrib = data.contributionPercent + boostPct;
  if (boostedContrib <= 25 && !appliedChanges.includes("boost-contribution")) {
    const boostedAnnual = Math.round((data.salary * boostedContrib) / 100);
    const boostedMatch = Math.round((data.salary * Math.min(boostedContrib, 6)) / 100);
    const boostedScore = computeScore(boostedContrib, data.autoIncrease, data.riskLevel);
    const boostedBalance = computeProjectedBalance(boostedAnnual, boostedMatch, yearsToRetirement, growthRate);
    const additionalPerYear = boostedAnnual + boostedMatch - annualContribution - employerContribution;

    suggestions.push({
      id: "boost-contribution",
      icon: <Percent className="w-4 h-4 text-blue-600" />,
      title: `Increase contribution by ${boostPct}%`,
      description: "A small increase now compounds into significant retirement savings over time.",
      scoreIncrease: boostedScore - score,
      newScore: boostedScore,
      additionalAnnualSavings: additionalPerYear,
      projectedBalance: boostedBalance,
      currentLabel: "Current contribution",
      currentValue: `${data.contributionPercent}%`,
      newLabel: "New contribution",
      newValue: `${boostedContrib}%`,
      apply: () => {
        updateData({ contributionPercent: boostedContrib });
      },
    });
  }

  // 2. Enable auto-increase
  if (!data.autoIncrease && !appliedChanges.includes("enable-auto-increase")) {
    const autoIncScore = computeScore(data.contributionPercent, true, data.riskLevel);
    // Estimate balance with auto-increase (simplified: avg extra 0.5% per year over the period)
    const avgExtraContrib = Math.round(
      (data.salary * Math.min(data.autoIncreaseAmount * (yearsToRetirement / 2), data.autoIncreaseMax - data.contributionPercent)) / 100
    );
    const autoIncBalance = computeProjectedBalance(
      annualContribution + avgExtraContrib,
      employerContribution,
      yearsToRetirement,
      growthRate
    );

    suggestions.push({
      id: "enable-auto-increase",
      icon: <TrendingUp className="w-4 h-4 text-green-600" />,
      title: "Enable automatic contribution increases",
      description: `Automatically increase your contribution by ${data.autoIncreaseAmount}% each year up to ${data.autoIncreaseMax}%.`,
      scoreIncrease: autoIncScore - score,
      newScore: autoIncScore,
      additionalAnnualSavings: avgExtraContrib,
      projectedBalance: autoIncBalance,
      currentLabel: "Auto-increase",
      currentValue: "Off",
      newLabel: "Auto-increase",
      newValue: `${data.autoIncreaseAmount}%/yr`,
      apply: () => {
        updateData({ autoIncrease: true });
      },
    });
  }

  // 3. Adjust strategy for higher growth
  const growthUpgrade: Record<string, string> = {
    conservative: "balanced",
    balanced: "growth",
  };
  const riskLabels: Record<string, string> = {
    conservative: "Conservative",
    balanced: "Balanced",
    growth: "Growth",
    aggressive: "Aggressive",
  };
  const nextRiskLevel = growthUpgrade[data.riskLevel];
  if (nextRiskLevel && !appliedChanges.includes("upgrade-strategy")) {
    const nextRate = growthRates[nextRiskLevel] || growthRate;
    const upgradeScore = computeScore(data.contributionPercent, data.autoIncrease, nextRiskLevel);
    const upgradeBalance = computeProjectedBalance(
      annualContribution,
      employerContribution,
      yearsToRetirement,
      nextRate
    );
    const extraBalancePerYear = Math.round((upgradeBalance - projectedBalance) / yearsToRetirement);

    suggestions.push({
      id: "upgrade-strategy",
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      title: "Adjust investment strategy for higher growth",
      description: `Switch from ${riskLabels[data.riskLevel]} to ${riskLabels[nextRiskLevel]} for potentially higher long-term returns.`,
      scoreIncrease: upgradeScore - score,
      newScore: upgradeScore,
      additionalAnnualSavings: extraBalancePerYear > 0 ? extraBalancePerYear : 0,
      projectedBalance: upgradeBalance,
      currentLabel: "Current strategy",
      currentValue: riskLabels[data.riskLevel],
      newLabel: "New strategy",
      newValue: riskLabels[nextRiskLevel],
      apply: () => {
        updateData({ riskLevel: nextRiskLevel as "conservative" | "balanced" | "growth" | "aggressive" });
      },
    });
  }

  // Sort suggestions by score impact (highest first)
  suggestions.sort((a, b) => b.scoreIncrease - a.scoreIncrease);

  // Calculate potential score with all recommendations
  const potentialScore = suggestions.length > 0 
    ? suggestions.reduce((max, s) => Math.max(max, s.newScore), score)
    : score;
  
  const totalPotentialIncrease = potentialScore - score;

  // ── Handlers ──

  const handleOpenConfirm = (suggestion: Suggestion) => {
    setConfirmingSuggestion(suggestion);
  };

  const handleApply = () => {
    if (!confirmingSuggestion) return;
    confirmingSuggestion.apply();
    setAppliedChanges((prev) => [...prev, confirmingSuggestion.id]);
    setConfirmingSuggestion(null);
    setSuccessMessage("Change applied successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleNext = () => {
    setCurrentStep(7);
    navigate("/review");
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <button
          onClick={() => {
            setCurrentStep(5);
            navigate("/investment");
          }}
          className="flex items-center gap-1 text-gray-500 mb-3 hover:text-gray-700"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-gray-900">Your Retirement Readiness</h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.9rem" }}>
          Here's how your choices add up before you finalize.
        </p>
      </div>

      {/* Two-column grid */}
      <div className="grid md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ── Left Column: score & projection ── */}
        <div className="space-y-5 min-w-0">
          {/* Score + Projected Balance — hero card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            {/* Score Circle — centered hero */}
            <div className="flex flex-col items-center">
              <AnimatedScore value={score} color={scoreColor} circumference={circumference} />

              {/* Explanatory text */}
              <p className="text-gray-800 mt-4 text-center" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                {getMessage()}
              </p>
              <p className="text-gray-500 mt-1 text-center" style={{ fontSize: "0.85rem" }}>
                You are{" "}
                <span style={{ fontWeight: 600 }}>{score}% on track</span> for your retirement goal.
              </p>
              <p className="text-gray-400 mt-1 text-center" style={{ fontSize: "0.75rem" }}>
                Most participants your age aim for a readiness score of 65 or higher.
              </p>
              
              {/* Target benchmark indicator */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-300 rounded-full" 
                    style={{ width: "65%" }}
                  />
                </div>
                <span className="text-gray-400" style={{ fontSize: "0.7rem", fontWeight: 500 }}>
                  Target: <span style={{ fontWeight: 600 }}>65</span>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-5" />

            {/* Projected balance */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <p className="text-gray-500" style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                  Projected retirement balance
                </p>
              </div>
              <p
                className="text-gray-900 tabular-nums"
                style={{ fontSize: "1.8rem", fontWeight: 700, transition: "all 0.5s ease" }}
              >
                {formatCurrency(projectedBalance)}
              </p>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.75rem" }}>
                In {yearsToRetirement} years with your current contribution and investment strategy.
              </p>
            </div>
          </div>

          {/* Success Banner — left column so it's near the score */}
          {successMessage && (
            <div
              className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5 flex items-center gap-3"
              style={{ animation: "fadeSlideIn 0.4s ease" }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-green-800" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                {successMessage}
              </p>
            </div>
          )}

          {/* Continue CTA — desktop only position */}
          <div className="hidden md:block pt-1">
            
          </div>
        </div>

        {/* ── Right Column: improvement actions ── */}
        <div className="space-y-4 min-w-0">
          {/* Merged Score + Progress Potential Card */}
          {suggestions.length > 0 && totalPotentialIncrease > 0 && (
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl px-5 py-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <p className="text-blue-900" style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                    Recommended for You
                  </p>
                </div>
                <div className="px-2 py-1 bg-green-100 rounded-lg">
                  <p className="text-green-700" style={{ fontSize: "0.75rem", fontWeight: 800 }}>
                    Score: {potentialScore}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-3" style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>
                You can reach a score of <span className="font-semibold text-blue-700">{potentialScore}</span> — apply the recommendations below to boost your readiness by <span style={{ fontWeight: 600 }}>+{totalPotentialIncrease} points</span>.
              </p>
            </div>
          )}
          
          {/* Improvement Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="mb-3">
                <p className="text-gray-900" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                  Optional ways to improve your readiness
                </p>
                <p className="text-gray-400 mt-1" style={{ fontSize: "0.75rem" }}>
                  You can apply one of these improvements to increase your retirement readiness score.
                </p>
              </div>

              <div className="space-y-2.5">
                {suggestions.map((suggestion, index) => {
                  const isRecommended = index === 0;
                  return (
                    <div
                      key={suggestion.id}
                      className={`rounded-xl border transition-all ${
                        isRecommended
                          ? "bg-white border-blue-200"
                          : "bg-gray-50/60 border-gray-150"
                      }`}
                    >
                      <div className="p-4">
                        {/* Recommended badge */}
                        {isRecommended && (
                          <div className="flex items-center gap-1 mb-2.5">
                            <Award className="w-3 h-3 text-blue-600" />
                            <span
                              className="text-blue-600"
                              style={{ fontSize: "0.62rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
                            >
                              Recommended
                            </span>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isRecommended ? "bg-blue-50" : "bg-gray-100"
                          }`}>
                            {suggestion.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                              {suggestion.title}
                            </p>
                            <p className="text-gray-500 mt-0.5" style={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
                              {suggestion.description}
                            </p>

                            {/* Impact metrics — score transition format */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
                              <div>
                                <p className="text-gray-400" style={{ fontSize: "0.62rem", fontWeight: 500 }}>
                                  Score
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="text-gray-400 tabular-nums" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                                    {score}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-gray-300" />
                                  <span className="text-green-700 tabular-nums" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                                    {suggestion.newScore}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-400" style={{ fontSize: "0.62rem", fontWeight: 500 }}>
                                  Savings
                                </p>
                                <p className="text-blue-700 mt-0.5 tabular-nums" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                                  +${suggestion.additionalAnnualSavings.toLocaleString()}/yr
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400" style={{ fontSize: "0.62rem", fontWeight: 500 }}>
                                  Balance
                                </p>
                                <p className="text-gray-900 mt-0.5 tabular-nums" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                                  {formatCurrency(suggestion.projectedBalance)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Apply Button - Tertiary style */}
                        <button
                          onClick={() => handleOpenConfirm(suggestion)}
                          className="w-full mt-3 bg-white text-foreground py-2 px-4 rounded-lg hover:bg-blue-50 transition-all border border-blue-200"
                          style={{ fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          Apply Recommendation
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All improvements applied */}
          {suggestions.length === 0 && appliedChanges.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-green-800" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                All improvements applied
              </p>
              <p className="text-green-600 mt-0.5" style={{ fontSize: "0.78rem" }}>
                Your score and balance have been optimized.
              </p>
            </div>
          )}
          
          {/* Continue Button - Moved to right section */}
          <div className="space-y-2.5 pt-4 border-t border-gray-200 mt-4">
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              Apply Recommendation <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleNext}
              className="w-full bg-white text-gray-700 py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all border border-gray-200"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              Continue with Custom Allocation
            </button>
          </div>
        </div>
      </div>

      {/* Continue CTA — mobile only, sticky bottom */}
      <div className="md:hidden sticky bottom-4 pt-4">
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg"
        >
          Continue to Review <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmingSuggestion}
        suggestion={confirmingSuggestion}
        currentScore={score}
        currentBalance={projectedBalance}
        formatCurrency={formatCurrency}
        onCancel={() => setConfirmingSuggestion(null)}
        onApply={handleApply}
      />

      {/* Keyframe animation for success banner */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}