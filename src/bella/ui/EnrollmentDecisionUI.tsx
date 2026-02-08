/**
 * EnrollmentDecisionUI
 *
 * Visual decision components for the enrollment flow. Replaces long chat bubbles
 * with cards, sliders, and buttons so users choose instead of typing.
 *
 * - PlanSelectionCards: Traditional 401(k) vs Roth 401(k)
 * - ContributionSelector: Preset buttons + slider (1–100%)
 * - InvestmentStrategySelector: Default / Manual / Advisor
 * - EnrollmentReviewSummaryCard: unified Review card for Default / Manual / Advisor
 */

import React, { useMemo } from "react";
import type { EnrollmentStep, EnrollmentState, InvestmentStrategy } from "../agents/planEnrollmentAgent";
import { MOCK_FUNDS_BY_CATEGORY } from "./ManualInvestmentUI";

export type PlanType = "401(k)" | "Roth 401(k)";

export interface EnrollmentDecisionUIProps {
  step: EnrollmentStep;
  isDarkMode: boolean;
  onPlanSelect: (value: string) => void;
  onContributionSelect: (value: string) => void;
  onInvestmentSelect: (value: string) => void;
  /** When true, only render the decision UI (cards/slider/buttons). Framing is already the last assistant message. */
  hideFraming?: boolean;
}

const CONTRIBUTION_PRESETS = [3, 6, 10, 15] as const;

export function PlanSelectionCards({
  isDarkMode,
  onSelect,
}: {
  isDarkMode: boolean;
  onSelect: (value: string) => void;
}) {
  const base =
    "flex-1 min-w-0 rounded-xl border-2 p-4 sm:p-5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent";
  const unselected = isDarkMode
    ? "border-gray-600 bg-gray-800/50 text-gray-200 hover:border-gray-500 hover:bg-gray-700/50"
    : "border-gray-200 bg-white/80 text-gray-800 hover:border-gray-300 hover:bg-white shadow-sm";

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
      role="group"
      aria-label="Choose plan type"
    >
      <button
        type="button"
        onClick={() => onSelect("traditional")}
        className={`${base} ${unselected}`}
        aria-pressed={undefined}
        aria-label="Select Traditional 401(k). Pre-tax contributions, taxable in retirement."
      >
        <span className="block font-semibold text-sm sm:text-base">Traditional 401(k)</span>
        <span
          className={
            isDarkMode ? "text-gray-400 text-xs sm:text-sm mt-1" : "text-gray-500 text-xs sm:text-sm mt-1"
          }
        >
          Pre-tax now, taxable later
        </span>
      </button>
      <button
        type="button"
        onClick={() => onSelect("roth")}
        className={`${base} ${unselected}`}
        aria-label="Select Roth 401(k). After-tax contributions, tax-free in retirement."
      >
        <span className="block font-semibold text-sm sm:text-base">Roth 401(k)</span>
        <span
          className={
            isDarkMode ? "text-gray-400 text-xs sm:text-sm mt-1" : "text-gray-500 text-xs sm:text-sm mt-1"
          }
        >
          After-tax now, tax-free later
        </span>
      </button>
    </div>
  );
}

export function ContributionSelector({
  isDarkMode,
  onSelect,
}: {
  isDarkMode: boolean;
  onSelect: (value: string) => void;
}) {
  const [sliderValue, setSliderValue] = React.useState(6);

  const handlePreset = (p: number) => {
    setSliderValue(p);
    onSelect(String(p));
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(e.target.value));
  };

  const commitSlider = () => {
    onSelect(`${sliderValue}%`);
  };

  const trackBg = isDarkMode ? "bg-gray-600" : "bg-gray-200";

  return (
    <div className="space-y-4" role="group" aria-label="Choose contribution percentage">
      <div className="flex flex-wrap gap-2">
        {CONTRIBUTION_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handlePreset(p)}
            className={
              isDarkMode
                ? "px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                : "px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }
            aria-label={`Contribute ${p} percent`}
          >
            {p}%
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <label htmlFor="enrollment-contribution-slider" className="sr-only">
          Contribution percentage
        </label>
        <input
          id="enrollment-contribution-slider"
          type="range"
          min={1}
          max={100}
          value={sliderValue}
          onChange={handleSlider}
          onMouseUp={commitSlider}
          onTouchEnd={commitSlider}
          className={`flex-1 h-2 rounded-full ${trackBg} accent-blue-600 cursor-pointer`}
          aria-valuemin={1}
          aria-valuemax={100}
          aria-valuenow={sliderValue}
          aria-valuetext={`${sliderValue} percent`}
        />
        <span
          className={
            isDarkMode
              ? "text-gray-200 font-semibold tabular-nums min-w-[2.5rem]"
              : "text-gray-800 font-semibold tabular-nums min-w-[2.5rem]"
          }
        >
          {sliderValue}%
        </span>
      </div>
    </div>
  );
}

export function InvestmentStrategySelector({
  isDarkMode,
  onSelect,
}: {
  isDarkMode: boolean;
  onSelect: (value: string) => void;
}) {
  const options: { value: string; label: string; hint: string }[] = [
    { value: "default", label: "Default", hint: "Automatic allocation" },
    { value: "manual", label: "Manual", hint: "Pick funds yourself" },
    { value: "advisor", label: "Advisor", hint: "Personalized guidance" },
  ];

  const btn =
    "flex-1 min-w-0 rounded-lg border-2 py-3 px-3 text-center text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const unselected = isDarkMode
    ? "border-gray-600 bg-gray-800/50 text-gray-200 hover:border-gray-500"
    : "border-gray-200 bg-white/80 text-gray-800 hover:border-gray-300";
  const hintClass = isDarkMode ? "text-gray-400 text-xs mt-0.5" : "text-gray-500 text-xs mt-0.5";

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3"
      role="group"
      aria-label="Choose investment approach"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          className={`${btn} ${unselected}`}
          aria-label={`${opt.label}: ${opt.hint}`}
        >
          <span className="block">{opt.label}</span>
          <span className={`block ${hintClass}`}>{opt.hint}</span>
        </button>
      ))}
    </div>
  );
}

/** Short framing copy for each decision step (replaces long chat text). */
export const ENROLLMENT_FRAMING: Record<string, string> = {
  PLAN_SELECTION: "Which plan would you like?",
  CONTRIBUTION: "What percentage do you want to contribute?",
  INVESTMENT: "How would you like to invest?",
  REVIEW: "Review your choices below.",
};

/** Data-driven labels by investment strategy */
const INVESTMENT_METHOD_LABEL: Record<InvestmentStrategy, string> = {
  DEFAULT: "Plan Default Investment",
  MANUAL: "User Selected Funds",
  ADVISOR: "Advisor Recommended Portfolio",
};

const CONTRIBUTION_TYPE_LABEL: Record<InvestmentStrategy, string> = {
  DEFAULT: "Default",
  MANUAL: "Manual",
  ADVISOR: "Advisor",
};

/**
 * Unified Review Summary Card for Default, Manual, and Advisor flows.
 * Renders whenever enrollment reaches REVIEW; content adapts from enrollmentState.
 */
export interface EnrollmentReviewSummaryCardProps {
  enrollmentState: EnrollmentState;
  isDarkMode: boolean;
  onConfirm: () => void;
  onEdit: () => void;
  onEditRetirementAge?: () => void;
  onEditRetirementLocation?: () => void;
}

export function EnrollmentReviewSummaryCard(props: EnrollmentReviewSummaryCardProps) {
  const { enrollmentState: s, isDarkMode, onConfirm, onEdit, onEditRetirementAge, onEditRetirementLocation } = props;
  const strategy = (s.investmentStrategy ?? "DEFAULT") as InvestmentStrategy;

  const planType = s.planType ?? "401(k)";
  const contributionType = CONTRIBUTION_TYPE_LABEL[strategy];
  const investmentMethod = INVESTMENT_METHOD_LABEL[strategy];
  const riskProfile = strategy === "MANUAL" ? (s.manualRiskLevel ?? "Conservative") : "N/A";
  const fundCount = strategy === "MANUAL" ? (s.manualSelectedFundIds?.length ?? 0) : strategy === "DEFAULT" ? 1 : 0;
  const totalAllocation = 100;

  const idToName = useMemo(() => {
    const m: Record<string, string> = {};
    MOCK_FUNDS_BY_CATEGORY.forEach((f) => (m[f.id] = f.name));
    return m;
  }, []);

  const manualBreakdown = useMemo(() => {
    if (strategy !== "MANUAL" || !s.manualSelectedFundIds?.length) return [];
    const alloc = s.manualAllocations ?? {};
    return s.manualSelectedFundIds
      .map((id) => ({ id, name: idToName[id] ?? id, pct: alloc[id] ?? 0 }))
      .filter((r) => r.pct > 0)
      .sort((a, b) => b.pct - a.pct);
  }, [strategy, s.manualSelectedFundIds, s.manualAllocations, idToName]);

  const card = isDarkMode
    ? "rounded-2xl border border-gray-600 bg-gray-800/90 shadow-xl overflow-hidden"
    : "rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden";
  const head = isDarkMode ? "bg-gray-700/80 text-gray-100" : "bg-gray-50 text-gray-800";
  const row = isDarkMode ? "border-gray-700" : "border-gray-100";
  const labelClass = isDarkMode ? "text-gray-400" : "text-gray-500";
  const valueClass = isDarkMode ? "text-gray-100" : "text-gray-900";
  const sectionClass = isDarkMode ? "text-gray-300" : "text-gray-700";

  const contributionPct = s.contributionPercentage ?? 6;
  const investmentValue =
    strategy === "DEFAULT"
      ? "System managed"
      : strategy === "MANUAL"
        ? "I'll choose my own investments"
        : "Work with an advisor";
  const investmentHelper =
    strategy === "DEFAULT"
      ? "Automatically adjusted over time"
      : strategy === "MANUAL"
        ? "You'll choose risk and funds"
        : "An advisor will help guide your investments";

  return (
    <div className={`${card} mt-4`} role="region" aria-labelledby="enrollment-review-heading">
      <div id="enrollment-review-heading" className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-base sm:text-lg ${head}`}>
        Review your enrollment
      </div>
      <div className="px-4 sm:px-6 py-4 space-y-4">
        {/* Three stacked summary cards: Plan (blue), Contribution (emerald), Investments (indigo) */}
        <div className="space-y-3">
          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 border-l-4 border-l-blue-500 dark:border-l-blue-400 shadow-sm hover:shadow-md transition-shadow">
            <p className={`text-xs sm:text-sm font-semibold ${labelClass}`}>Selected Plan</p>
            <p className={`font-medium ${valueClass} mt-0.5`}>{planType}</p>
            <p className={`text-xs ${labelClass} mt-0.5`}>
              {planType === "Roth 401(k)" ? "Pay tax now, withdrawals may be tax-free later." : "Pay tax later, taxes apply when you withdraw."}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
            <p className={`text-xs sm:text-sm font-semibold ${labelClass}`}>Your contribution</p>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{contributionPct}% of your salary</p>
            <p className={`text-xs ${labelClass} mt-0.5`}>You can change this later.</p>
          </div>
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
            <p className={`text-xs sm:text-sm font-semibold ${labelClass}`}>Your investments</p>
            <p className={`font-medium ${valueClass} mt-0.5`}>{investmentValue}</p>
            <p className={`text-xs ${labelClass} mt-0.5`}>{investmentHelper}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Plan type</p>
            <p className={`font-medium ${valueClass}`}>{planType}</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Contribution type</p>
            <p className={`font-medium ${valueClass}`}>{contributionType}</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Risk profile</p>
            <p className={`font-medium ${valueClass}`}>
              {strategy === "MANUAL" ? riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1) : "N/A"}
            </p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Investment method</p>
            <p className={`font-medium ${valueClass}`}>{investmentMethod}</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Number of funds</p>
            <p className={`font-medium ${valueClass}`}>{strategy === "MANUAL" ? fundCount : strategy === "DEFAULT" ? 1 : "—"}</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Total allocation</p>
            <p className={`font-medium ${valueClass}`}>{totalAllocation}%</p>
          </div>

          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Retirement age</p>
            <div className="flex items-center gap-2">
              <p className={`font-medium ${valueClass}`}>{s.retirementAge ?? "—"}</p>
              {onEditRetirementAge && (
                <button
                  type="button"
                  onClick={onEditRetirementAge}
                  className={`text-xs sm:text-sm font-medium underline underline-offset-4 ${isDarkMode ? "text-gray-200 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Retirement location</p>
            <div className="flex items-center gap-2">
              <p className={`font-medium ${valueClass}`}>{s.workCountry ?? "—"}</p>
              {onEditRetirementLocation && (
                <button
                  type="button"
                  onClick={onEditRetirementLocation}
                  className={`text-xs sm:text-sm font-medium underline underline-offset-4 ${isDarkMode ? "text-gray-200 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Conditional section by flow type */}
        <div>
          <p className={`text-sm font-medium ${sectionClass} mb-2`}>
            {strategy === "DEFAULT" ? "Default fund" : strategy === "MANUAL" ? "Allocation breakdown" : "Advisor model"}
          </p>
          {strategy === "DEFAULT" && (
            <div className={`rounded-lg border ${row} px-3 py-2.5 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
              Plan default allocation (Target Date based on retirement year)
            </div>
          )}
          {strategy === "MANUAL" && (
            <ul className={`rounded-lg border ${row} divide-y ${row}`}>
              {manualBreakdown.length ? (
                manualBreakdown.map(({ id, name, pct }) => (
                  <li key={id} className="flex justify-between items-center px-3 py-2 sm:py-2.5 text-sm">
                    <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>{name}</span>
                    <span className={`font-medium tabular-nums ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>{pct}%</span>
                  </li>
                ))
              ) : (
                <li className={`px-3 py-2 text-sm ${labelClass}`}>No allocations yet</li>
              )}
            </ul>
          )}
          {strategy === "ADVISOR" && (
            <div className={`rounded-lg border ${row} px-3 py-2.5 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
              RetireReady Balanced — Age-based allocation managed by your advisor.
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
          <button
            type="button"
            onClick={onEdit}
            className={`
              flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-medium
              ${isDarkMode
                ? "border border-gray-600 text-gray-300 hover:bg-gray-700/50"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
          >
            Edit selection
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Confirm & submit enrollment
          </button>
        </div>
      </div>
    </div>
  );
}

export function EnrollmentDecisionBlock(props: EnrollmentDecisionUIProps) {
  const { step, isDarkMode, onPlanSelect, onContributionSelect, onInvestmentSelect, hideFraming } = props;
  const framing = ENROLLMENT_FRAMING[step];
  if (!framing) return null;

  return (
    <div
      className={
        isDarkMode
          ? "rounded-2xl border border-gray-700/50 bg-gray-800/40 backdrop-blur-md p-4 sm:p-5 mt-2"
          : "rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-md p-4 sm:p-5 mt-2 shadow-sm"
      }
      role="region"
      aria-labelledby={hideFraming ? undefined : "enrollment-decision-heading"}
    >
      {!hideFraming && (
        <p
          id="enrollment-decision-heading"
          className={
            isDarkMode
              ? "text-gray-200 font-medium text-sm sm:text-base mb-4"
              : "text-gray-800 font-medium text-sm sm:text-base mb-4"
          }
        >
          {framing}
        </p>
      )}
      {step === "PLAN_SELECTION" && (
        <PlanSelectionCards isDarkMode={isDarkMode} onSelect={onPlanSelect} />
      )}
      {step === "CONTRIBUTION" && (
        <ContributionSelector isDarkMode={isDarkMode} onSelect={onContributionSelect} />
      )}
      {step === "INVESTMENT" && (
        <InvestmentStrategySelector isDarkMode={isDarkMode} onSelect={onInvestmentSelect} />
      )}
    </div>
  );
}
