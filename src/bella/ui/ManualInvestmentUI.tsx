/**
 * ManualInvestmentUI
 *
 * Hybrid conversational + structured UI for manual fund selection.
 * Steps: Risk comfort → Fund selection (one per category) → Allocation % (must total 100%).
 *
 * - RiskComfortSelector: cards (Conservative / Moderate / Growth / Aggressive)
 * - FundCards: one fund per asset category with key metrics
 * - AllocationSliders: per-fund % with live total and validation feedback
 */

import React, { useMemo, useState, useEffect } from "react";
import type { EnrollmentStep } from "../agents/planEnrollmentAgent";

export type ManualRiskLevel = "conservative" | "moderate" | "growth" | "aggressive";

export interface FundOption {
  id: string;
  name: string;
  category: string;
  return1y: string;
  expenseRatio: string;
}

/** Mock funds by category — one selection required per category */
export const MOCK_FUNDS_BY_CATEGORY: FundOption[] = [
  { id: "us-lg", name: "US Large Cap Index", category: "US Stock", return1y: "+12.4%", expenseRatio: "0.02%" },
  { id: "us-mid", name: "US Mid Cap Index", category: "US Stock", return1y: "+10.1%", expenseRatio: "0.03%" },
  { id: "us-sm", name: "US Small Cap Index", category: "US Stock", return1y: "+8.7%", expenseRatio: "0.04%" },
  { id: "intl", name: "International Index", category: "International", return1y: "+6.2%", expenseRatio: "0.06%" },
  { id: "intl-em", name: "Emerging Markets", category: "International", return1y: "+4.1%", expenseRatio: "0.12%" },
  { id: "bond-ag", name: "Bond Aggregate", category: "Bonds", return1y: "+2.3%", expenseRatio: "0.03%" },
  { id: "bond-tips", name: "TIPS", category: "Bonds", return1y: "+1.8%", expenseRatio: "0.05%" },
];

const RISK_OPTIONS: { value: ManualRiskLevel; label: string; hint: string }[] = [
  { value: "conservative", label: "Conservative", hint: "Less risk, steadier" },
  { value: "moderate", label: "Moderate", hint: "Balanced" },
  { value: "growth", label: "Growth", hint: "More growth, more risk" },
  { value: "aggressive", label: "Aggressive", hint: "Highest growth potential" },
];

/** Short framing per manual step */
export const MANUAL_FRAMING: Record<string, string> = {
  MANUAL_RISK: "How much risk are you comfortable with?",
  MANUAL_FUNDS: "Pick one fund per category.",
  MANUAL_ALLOCATION: "Set the percentage for each fund. Total must equal 100%.",
};

export function RiskComfortSelector({
  isDarkMode,
  onSelect,
}: {
  isDarkMode: boolean;
  onSelect: (value: string) => void;
}) {
  const btn =
    "flex-1 min-w-0 rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const unselected = isDarkMode
    ? "border-gray-600 bg-gray-800/50 text-gray-200 hover:border-gray-500"
    : "border-gray-200 bg-white/80 text-gray-800 hover:border-gray-300 hover:bg-white";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3" role="group" aria-label="Risk comfort">
      {RISK_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          className={`${btn} ${unselected}`}
          aria-label={`${opt.label}: ${opt.hint}`}
        >
          <span className="block font-semibold text-sm">{opt.label}</span>
          <span className={isDarkMode ? "text-gray-400 text-xs mt-0.5" : "text-gray-500 text-xs mt-0.5"}>
            {opt.hint}
          </span>
        </button>
      ))}
    </div>
  );
}

function groupByCategory(funds: FundOption[]): Record<string, FundOption[]> {
  return funds.reduce<Record<string, FundOption[]>>((acc, f) => {
    (acc[f.category] = acc[f.category] || []).push(f);
    return acc;
  }, {});
}

export function FundCards({
  isDarkMode,
  selectedById,
  onToggle,
  onContinue,
  canContinue,
}: {
  isDarkMode: boolean;
  selectedById: Record<string, boolean>;
  onToggle: (id: string, category: string) => void;
  onContinue: () => void;
  canContinue: boolean;
}) {
  const byCategory = useMemo(() => groupByCategory(MOCK_FUNDS_BY_CATEGORY), []);
  const categories = Object.keys(byCategory).sort();

  const card =
    "rounded-xl border-2 p-3 sm:p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500";
  const unselected = isDarkMode
    ? "border-gray-600 bg-gray-800/50 text-gray-200 hover:border-gray-500"
    : "border-gray-200 bg-white/80 text-gray-800 hover:border-gray-300";
  const selected = isDarkMode
    ? "border-blue-400 bg-blue-900/40 text-blue-100 ring-2 ring-blue-400/30"
    : "border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500/30";

  return (
    <div className="space-y-4" role="region" aria-label="Fund selection by category">
      {categories.map((cat) => {
        const funds = byCategory[cat];
        const selectedInCat = funds.find((f) => selectedById[f.id]);
        return (
          <div key={cat}>
            <p
              className={
                isDarkMode
                  ? "text-gray-300 text-sm font-medium mb-2"
                  : "text-gray-700 text-sm font-medium mb-2"
              }
            >
              {cat}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {funds.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onToggle(f.id, f.category)}
                  className={`${card} ${selectedById[f.id] ? selected : unselected}`}
                  aria-pressed={!!selectedById[f.id]}
                  aria-label={`${f.name}, 1Y return ${f.return1y}, fee ${f.expenseRatio}. ${selectedById[f.id] ? "Selected" : "Select"}`}
                >
                  <span className="block font-semibold text-sm">{f.name}</span>
                  <span className={isDarkMode ? "text-gray-400 text-xs mt-1" : "text-gray-500 text-xs mt-1"}>
                    {f.return1y} · {f.expenseRatio}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <div className="pt-2">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={
            canContinue
              ? "w-full py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              : "w-full py-2.5 rounded-xl font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
          }
          aria-disabled={!canContinue}
        >
          Continue to allocation
        </button>
      </div>
    </div>
  );
}

export function AllocationSliders({
  isDarkMode,
  funds,
  allocations,
  onChange,
  onContinue,
}: {
  isDarkMode: boolean;
  funds: FundOption[];
  allocations: Record<string, number>;
  onChange: (id: string, value: number) => void;
  onContinue: () => void;
}) {
  const total = Object.values(allocations).reduce((a, b) => a + b, 0);
  const isValid = Math.abs(total - 100) < 0.5;
  const hintClass = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className="space-y-4" role="region" aria-label="Allocation percentages">
      {funds.map((f) => (
        <div key={f.id} className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label htmlFor={`alloc-${f.id}`} className="text-sm font-medium">
              {f.name}
            </label>
            <span
              className={`tabular-nums text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
            >
              {allocations[f.id] ?? 0}%
            </span>
          </div>
          <input
            id={`alloc-${f.id}`}
            type="range"
            min={0}
            max={100}
            value={allocations[f.id] ?? 0}
            onChange={(e) => onChange(f.id, Number(e.target.value))}
            className="w-full h-2 rounded-full accent-blue-600 cursor-pointer"
            aria-valuenow={allocations[f.id] ?? 0}
            aria-valuetext={`${allocations[f.id] ?? 0} percent`}
          />
        </div>
      ))}
      {/* Validation feedback */}
      <div
        role="status"
        aria-live="polite"
        className={`text-sm ${isValid ? hintClass : "text-amber-600 font-medium"}`}
      >
        {isValid ? (
          <>Total: 100%</>
        ) : (
          <>Total: {total.toFixed(0)}%. Adjust so it equals 100%.</>
        )}
      </div>
      <button
        type="button"
        onClick={onContinue}
        disabled={!isValid}
        className={
          isValid
            ? "w-full py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            : "w-full py-2.5 rounded-xl font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
        }
        aria-disabled={!isValid}
      >
        Continue to review
      </button>
    </div>
  );
}

/** Manual flow REVIEW step: structured summary card with Confirm / Edit actions */
export interface ManualReviewSummaryCardProps {
  isDarkMode: boolean;
  planType?: string;
  riskProfile?: string;
  fundCount: number;
  allocations: Record<string, number>;
  selectedFundIds: string[];
  onConfirm: () => void;
  onEdit: () => void;
}

export function ManualReviewSummaryCard(props: ManualReviewSummaryCardProps) {
  const {
    isDarkMode,
    planType = "401(k)",
    riskProfile = "Conservative",
    fundCount,
    allocations,
    selectedFundIds,
    onConfirm,
    onEdit,
  } = props;

  const idToName = useMemo(() => {
    const m: Record<string, string> = {};
    MOCK_FUNDS_BY_CATEGORY.forEach((f) => (m[f.id] = f.name));
    return m;
  }, []);

  const breakdown = useMemo(
    () =>
      selectedFundIds
        .map((id) => ({ id, name: idToName[id] ?? id, pct: allocations[id] ?? 0 }))
        .filter((r) => r.pct > 0)
        .sort((a, b) => b.pct - a.pct),
    [selectedFundIds, allocations, idToName]
  );

  const total = Object.values(allocations).reduce((a, b) => a + b, 0);
  const card = isDarkMode
    ? "rounded-2xl border border-gray-600 bg-gray-800/90 shadow-xl overflow-hidden"
    : "rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden";
  const head = isDarkMode ? "bg-gray-700/80 text-gray-100" : "bg-gray-50 text-gray-800";
  const row = isDarkMode ? "border-gray-700" : "border-gray-100";
  const labelClass = isDarkMode ? "text-gray-400" : "text-gray-500";
  const valueClass = isDarkMode ? "text-gray-100" : "text-gray-900";
  const sectionClass = isDarkMode ? "text-gray-300" : "text-gray-700";

  return (
    <div className={`${card} mt-4`} role="region" aria-labelledby="manual-review-heading">
      <div id="manual-review-heading" className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-base sm:text-lg ${head}`}>
        Review your enrollment
      </div>
      <div className="px-4 sm:px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Plan type</p>
            <p className={`font-medium ${valueClass}`}>{planType}</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Contribution type</p>
            <p className={`font-medium ${valueClass}`}>Manual</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Risk profile</p>
            <p className={`font-medium ${valueClass}`}>{riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Funds selected</p>
            <p className={`font-medium ${valueClass}`}>{fundCount}</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${labelClass}`}>Total allocation</p>
            <p className={`font-medium ${valueClass}`}>{total.toFixed(0)}%</p>
          </div>
        </div>

        <div>
          <p className={`text-sm font-medium ${sectionClass} mb-2`}>Allocation breakdown</p>
          <ul className={`rounded-lg border ${row} divide-y ${row}`}>
            {breakdown.length ? (
              breakdown.map(({ id, name, pct }) => (
                <li key={id} className="flex justify-between items-center px-3 py-2 sm:py-2.5 text-sm">
                  <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>{name}</span>
                  <span className={`font-medium tabular-nums ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {pct}%
                  </span>
                </li>
              ))
            ) : (
              <li className={`px-3 py-2 text-sm ${labelClass}`}>No allocations yet</li>
            )}
          </ul>
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
            Confirm & submit
          </button>
        </div>
      </div>
    </div>
  );
}

export interface ManualInvestmentBlockProps {
  step: EnrollmentStep;
  isDarkMode: boolean;
  manualRiskLevel?: string;
  manualSelectedFundIds?: string[];
  manualAllocations?: Record<string, number>;
  onRiskSelect: (value: string) => void;
  onFundsContinue: (selectedIds: string[]) => void;
  onAllocationContinue: (allocations: Record<string, number>) => void;
  hideFraming?: boolean;
}

export function ManualInvestmentBlock(props: ManualInvestmentBlockProps) {
  const {
    step,
    isDarkMode,
    manualSelectedFundIds = [],
    manualAllocations = {},
    onRiskSelect,
    onFundsContinue,
    onAllocationContinue,
    hideFraming,
  } = props;

  const [localSelected, setLocalSelected] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    manualSelectedFundIds.forEach((id) => (o[id] = true));
    return o;
  });
  const [localAlloc, setLocalAlloc] = useState<Record<string, number>>(() => ({ ...manualAllocations }));

  const framing = MANUAL_FRAMING[step];
  if (!framing && step !== "MANUAL_FUNDS" && step !== "MANUAL_ALLOCATION") return null;

  const byCategory = useMemo(() => groupByCategory(MOCK_FUNDS_BY_CATEGORY), []);
  const categories = Object.keys(byCategory).sort();
  const onePerCategory = categories.every((c) =>
    (byCategory[c] || []).some((f) => localSelected[f.id])
  );
  const selectedIds = Object.entries(localSelected)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const fundsForAllocation = useMemo(
    () =>
      step === "MANUAL_ALLOCATION" && manualSelectedFundIds.length
        ? MOCK_FUNDS_BY_CATEGORY.filter((f) => manualSelectedFundIds.includes(f.id))
        : [],
    [step, manualSelectedFundIds]
  );

  useEffect(() => {
    if (step === "MANUAL_ALLOCATION" && fundsForAllocation.length) {
      const defaultPct = Math.floor(100 / fundsForAllocation.length);
      const extra = 100 - defaultPct * fundsForAllocation.length;
      const next: Record<string, number> = {};
      fundsForAllocation.forEach((f, i) => {
        next[f.id] = manualAllocations[f.id] ?? defaultPct + (i < extra ? 1 : 0);
      });
      setLocalAlloc(next);
    }
  }, [step, manualSelectedFundIds.join(",")]);

  const allocForSliders =
    step === "MANUAL_ALLOCATION"
      ? fundsForAllocation.reduce<Record<string, number>>((acc, f) => {
          acc[f.id] = localAlloc[f.id] ?? 0;
          return acc;
        }, {})
      : {};

  const handleToggle = (id: string, category: string) => {
    setLocalSelected((prev) => {
      const next = { ...prev };
      (byCategory[category] || []).forEach((f) => (next[f.id] = f.id === id ? !prev[f.id] : false));
      return next;
    });
  };

  const handleFundsContinue = () => {
    const ids = Object.entries(localSelected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (ids.length && onePerCategory) onFundsContinue(ids);
  };

  const handleAllocChange = (id: string, value: number) => {
    setLocalAlloc((prev) => ({ ...prev, [id]: value }));
  };

  const handleAllocContinue = () => {
    const total = Object.values(localAlloc).reduce((a, b) => a + b, 0);
    if (Math.abs(total - 100) < 0.5) onAllocationContinue(localAlloc);
  };

  const container = isDarkMode
    ? "rounded-2xl border border-gray-700/50 bg-gray-800/40 backdrop-blur-md p-4 sm:p-5 mt-2"
    : "rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-md p-4 sm:p-5 mt-2 shadow-sm";

  return (
    <div className={container} role="region" aria-labelledby={hideFraming ? undefined : "manual-invest-heading"}>
      {!hideFraming && framing && (
        <p
          id="manual-invest-heading"
          className={isDarkMode ? "text-gray-200 font-medium text-sm sm:text-base mb-4" : "text-gray-800 font-medium text-sm sm:text-base mb-4"}
        >
          {framing}
        </p>
      )}
      {step === "MANUAL_RISK" && <RiskComfortSelector isDarkMode={isDarkMode} onSelect={onRiskSelect} />}
      {step === "MANUAL_FUNDS" && (
        <FundCards
          isDarkMode={isDarkMode}
          selectedById={localSelected}
          onToggle={handleToggle}
          onContinue={handleFundsContinue}
          canContinue={onePerCategory && selectedIds.length >= 1}
        />
      )}
      {step === "MANUAL_ALLOCATION" && (
        <AllocationSliders
          isDarkMode={isDarkMode}
          funds={fundsForAllocation.length ? fundsForAllocation : []}
          allocations={allocForSliders}
          onChange={handleAllocChange}
          onContinue={handleAllocContinue}
        />
      )}
    </div>
  );
}
