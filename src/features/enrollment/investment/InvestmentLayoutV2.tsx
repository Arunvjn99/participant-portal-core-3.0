/**
 * Investment step — UI layout only. No local state.
 * Uses enrollment-v2 components for Figma parity: AIRecommendationBanner, NeedInvestmentHelpCard,
 * AllocationBySourceCard, DiversifiedTaxStrategyCallout, InvestmentStrategyCard,
 * InvestmentSummaryCard, AllocationSummaryChart.
 * Profile options and selection come from props (useEnrollment).
 */
import { RefreshCw, Users, Repeat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AIRecommendationBanner } from "../../../enrollment-v2/components/AIRecommendationBanner";
import { NeedInvestmentHelpCard } from "../../../enrollment-v2/components/NeedInvestmentHelpCard";
import { AllocationBySourceCard } from "../../../enrollment-v2/components/AllocationBySourceCard";
import type { AllocationBySourceRow } from "../../../enrollment-v2/components/AllocationBySourceCard";
import { DiversifiedTaxStrategyCallout } from "../../../enrollment-v2/components/DiversifiedTaxStrategyCallout";
import { InvestmentStrategyCard } from "../../../enrollment-v2/components/InvestmentStrategyCard";
import type { InvestmentStrategyCardOption } from "../../../enrollment-v2/components/InvestmentStrategyCard";
import { InvestmentSummaryCard } from "../../../enrollment-v2/components/InvestmentSummaryCard";
import type { InvestmentSummaryCardOption } from "../../../enrollment-v2/components/InvestmentSummaryCard";
import { AllocationSummaryChart } from "../../../enrollment-v2/components/AllocationSummaryChart";

export interface InvestmentProfileOption extends InvestmentStrategyCardOption, InvestmentSummaryCardOption {
  id: string;
  label: string;
  riskLabel: string;
  description: string;
  isRecommended?: boolean;
  icon?: LucideIcon;
}

export interface InvestmentLayoutV2Props {
  title: string;
  subtitle: string;
  aiRecommendationText?: string;
  profileOptions: InvestmentProfileOption[];
  selectedProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onAskAI?: () => void;
  onEditStrategy?: () => void;
  /** Allocation donut: segments and optional estimated value */
  allocationData?: Array<{ name: string; value: number; color: string }>;
  fundLabels?: Array<{ name: string; color: string }>;
  estimatedAtRetirement?: number;
  yearsToRetirement?: number;
  avgReturnPercent?: number;
  /** Source allocation for "Allocation by Source" card (preTax, roth, afterTax %). */
  sourceAllocation?: { preTax: number; roth: number; afterTax: number };
  onChooseMyOwnInvestments?: () => void;
  onChatNow?: () => void;
  onConnect?: () => void;
}

const SOURCE_ROW = (
  label: string,
  percent: number,
  fundsLabel: string
): AllocationBySourceRow => {
  const isPreTax = label.toLowerCase().includes("pre");
  const isRoth = label.toLowerCase().includes("roth");
  const color = isPreTax ? "var(--chart-1)" : isRoth ? "var(--chart-2)" : "var(--chart-3)";
  const barFrom = isPreTax ? "var(--chart-1)" : isRoth ? "var(--chart-2)" : "var(--chart-3)";
  const barTo = color;
  const pillBg = "var(--surface-2)";
  const pillText = "var(--text-primary)";
  return {
    label,
    percent,
    fundsLabel,
    color,
    barColorFrom: barFrom,
    barColorTo: barTo,
    pillBg,
    pillText,
  };
};

export function InvestmentLayoutV2({
  title,
  subtitle,
  aiRecommendationText,
  profileOptions,
  selectedProfileId,
  onSelectProfile,
  onAskAI,
  onEditStrategy,
  allocationData,
  fundLabels,
  estimatedAtRetirement,
  yearsToRetirement,
  avgReturnPercent,
  sourceAllocation,
  onChooseMyOwnInvestments,
  onChatNow,
  onConnect,
}: InvestmentLayoutV2Props) {
  const selectedOption = selectedProfileId
    ? profileOptions.find((p) => p.id === selectedProfileId)
    : null;

  const defaultAllocationData: Array<{ name: string; value: number; color: string }> =
    selectedOption?.allocation
      ? [
          { name: "Stocks", value: selectedOption.allocation.stocks, color: "var(--chart-1)" },
          { name: "Bonds", value: selectedOption.allocation.bonds, color: "var(--chart-2)" },
          { name: "Other", value: selectedOption.allocation.other, color: "var(--chart-3)" },
        ]
      : [
          { name: "Stocks", value: 60, color: "var(--chart-1)" },
          { name: "Bonds", value: 30, color: "var(--chart-2)" },
          { name: "Other", value: 10, color: "var(--chart-3)" },
        ];

  const allocationBySourceRows: AllocationBySourceRow[] = sourceAllocation
    ? [
        SOURCE_ROW("Pre-tax", sourceAllocation.preTax, sourceAllocation.preTax > 0 ? "2 funds" : "0 funds"),
        SOURCE_ROW("Roth", sourceAllocation.roth, sourceAllocation.roth > 0 ? "1 fund" : "0 funds"),
        SOURCE_ROW("After-tax", sourceAllocation.afterTax, sourceAllocation.afterTax > 0 ? "1 fund" : "0 funds"),
      ]
    : [
        SOURCE_ROW("Pre-tax", 60, "2 funds"),
        SOURCE_ROW("Roth", 25, "1 fund"),
        SOURCE_ROW("After-tax", 15, "1 fund"),
      ];

  const chartData = allocationData ?? defaultAllocationData;
  const defaultFundLabels = [
    { name: "S&P 500 Index Fund", color: "var(--chart-1)" },
    { name: "Total Bond Market Index", color: "var(--chart-2)" },
    { name: "International Stock Index", color: "var(--chart-3)" },
  ];

  return (
    <div className="relative min-h-[60vh] rounded-2xl min-w-0 border border-[var(--enroll-card-border)] shadow-sm" style={{ background: "var(--enroll-card-bg)" }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 p-6">
        <div className="lg:col-span-2 space-y-6 min-w-0" data-investment-strategy-cards>
            {aiRecommendationText && (
              <AIRecommendationBanner
                title="💡 AI Recommendation"
                description={aiRecommendationText}
                onAskAI={onAskAI}
              />
            )}

            <NeedInvestmentHelpCard
              onChatNow={onChatNow}
              onConnect={onConnect}
            />

            <AllocationBySourceCard
              rows={allocationBySourceRows}
              onChooseMyOwn={onChooseMyOwnInvestments}
            />

            <DiversifiedTaxStrategyCallout />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileOptions.map((opt) => (
              <InvestmentStrategyCard
                key={opt.id}
                option={opt}
                isSelected={selectedProfileId === opt.id}
                onSelect={() => onSelectProfile(opt.id)}
                icon={opt.icon}
              />
            ))}
            </div>
          </div>

        <div className="lg:col-span-1 space-y-6 min-w-0">
          {selectedOption && (
            <>
              <InvestmentSummaryCard
                option={selectedOption}
                onEditStrategy={onEditStrategy}
                icon={selectedOption.icon}
              />
              <AllocationSummaryChart
                allocationData={chartData}
                fundLabels={fundLabels ?? defaultFundLabels}
                estimatedAtRetirement={estimatedAtRetirement}
                yearsToRetirement={yearsToRetirement}
                avgReturnPercent={avgReturnPercent}
                showValidBadge
              />
            </>
          )}

          <div
            className="rounded-2xl border border-[var(--enroll-card-border)] p-5 shadow-sm space-y-4"
            style={{ background: "var(--enroll-card-bg)" }}
          >
            <h4 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
              Your portfolio includes
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="flex-shrink-0" style={{ color: "var(--brand-primary)" }}>
                  <RefreshCw className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <strong style={{ color: "var(--text-primary)" }}>
                    Automatic Rebalancing
                  </strong>{" "}
                  — Your portfolio is automatically rebalanced quarterly to maintain your target
                  allocation.
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="flex-shrink-0" style={{ color: "var(--brand-primary)" }}>
                  <Users className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <strong style={{ color: "var(--text-primary)" }}>
                    Professional Management
                  </strong>{" "}
                  — Expert portfolio managers handle all investment decisions and monitoring for you.
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="flex-shrink-0" style={{ color: "var(--brand-primary)" }}>
                  <Repeat className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <strong style={{ color: "var(--text-primary)" }}>
                    Change Anytime
                  </strong>{" "}
                  — Switch between portfolios at any time as your goals and risk tolerance evolve.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
