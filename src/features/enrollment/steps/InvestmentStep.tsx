import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Gauge,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
  Flame,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import type { RiskLevel } from "../types";
import { getGrowthRate } from "../utils/calculations";

const IV = "enrollment.v1.investment.";

interface FundDetail {
  name: string;
  ticker: string;
  expense: string;
}

interface AllocationEntry {
  name: string;
  value: number;
  color: string;
  funds: FundDetail[];
}

const ALLOCATION_BY_RISK: Record<RiskLevel, AllocationEntry[]> = {
  conservative: [
    { name: "Bonds", value: 45, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }, { name: "PIMCO Income Fund", ticker: "PONAX", expense: "0.59%" }] },
    { name: "US Stocks", value: 25, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }] },
    { name: "International Stocks", value: 15, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }] },
    { name: "Real Estate", value: 15, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
  balanced: [
    { name: "US Stocks", value: 40, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }, { name: "Vanguard Mid-Cap Index", ticker: "VIMAX", expense: "0.05%" }] },
    { name: "Bonds", value: 25, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }] },
    { name: "International Stocks", value: 20, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }] },
    { name: "Real Estate", value: 15, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
  growth: [
    { name: "US Stocks", value: 50, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }, { name: "Vanguard Growth Index", ticker: "VIGAX", expense: "0.05%" }] },
    { name: "International Stocks", value: 20, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }] },
    { name: "Bonds", value: 20, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }] },
    { name: "Real Estate", value: 10, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
  aggressive: [
    { name: "US Stocks", value: 50, color: "#10b981", funds: [{ name: "Vanguard Total Stock Market", ticker: "VTSAX", expense: "0.04%" }, { name: "Vanguard Small-Cap Growth", ticker: "VSGAX", expense: "0.07%" }] },
    { name: "International Stocks", value: 20, color: "#8b5cf6", funds: [{ name: "International Growth Fund", ticker: "VWIGX", expense: "0.42%" }, { name: "Vanguard Emerging Markets", ticker: "VEMAX", expense: "0.14%" }] },
    { name: "Bonds", value: 20, color: "#3b82f6", funds: [{ name: "Vanguard Total Bond Market", ticker: "VBTLX", expense: "0.05%" }] },
    { name: "Real Estate", value: 10, color: "#f59e0b", funds: [{ name: "Vanguard Real Estate Index", ticker: "VGSLX", expense: "0.12%" }] },
  ],
};

const RISK_META: Record<
  RiskLevel,
  { icon: typeof Shield; returnRange: string; riskDisplay: string }
> = {
  conservative: { icon: Shield, returnRange: "3–5%", riskDisplay: "Low" },
  balanced: { icon: TrendingUp, returnRange: "5–8%", riskDisplay: "Low-Medium" },
  growth: { icon: Zap, returnRange: "7–10%", riskDisplay: "Moderate" },
  aggressive: { icon: Flame, returnRange: "8–12%", riskDisplay: "High" },
};

export function InvestmentStep() {
  const { t } = useTranslation();
  const { riskLevel, updateField } = useEnrollmentStore();
  const [showFunds, setShowFunds] = useState(false);

  const handleSelect = (level: RiskLevel) => {
    updateField("riskLevel", level);
    updateField("useRecommendedPortfolio", true);
  };

  const allocation = riskLevel ? ALLOCATION_BY_RISK[riskLevel] : null;

  return (
    <div className="ew-step" style={{ gap: "1.5rem" }}>
      {/* Header */}
      <div className="text-left">
        <h1
          className="text-2xl font-semibold leading-tight tracking-tight"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {t(`${IV}title`, "Investment Strategy")}
        </h1>
        <p
          className="mt-1.5 text-sm leading-snug"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          {t(
            `${IV}subtitle`,
            "Choose a risk level that matches your timeline and comfort with market fluctuations.",
          )}
        </p>
      </div>

      {/* Risk level cards */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        {(
          ["conservative", "balanced", "growth", "aggressive"] as RiskLevel[]
        ).map((level) => {
          const isSelected = riskLevel === level;
          const meta = RISK_META[level];
          const Icon = meta.icon;
          const rate = getGrowthRate(level);

          return (
            <button
              key={level}
              type="button"
              onClick={() => handleSelect(level)}
              aria-pressed={isSelected}
              className="flex min-w-0 flex-col rounded-2xl border p-5 text-left transition-all duration-200"
              style={{
                borderColor: isSelected
                  ? "var(--enroll-brand)"
                  : "var(--enroll-card-border)",
                borderWidth: isSelected ? "2px" : "1px",
                background: isSelected
                  ? "color-mix(in srgb, var(--enroll-brand) 4%, var(--enroll-card-bg))"
                  : "var(--enroll-card-bg)",
                boxShadow: isSelected
                  ? "0 4px 20px color-mix(in srgb, var(--enroll-brand) 12%, transparent)"
                  : "var(--enroll-elevation-1)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: isSelected
                      ? "color-mix(in srgb, var(--enroll-brand) 12%, var(--enroll-card-bg))"
                      : "color-mix(in srgb, var(--enroll-card-border) 30%, var(--enroll-card-bg))",
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{
                      color: isSelected
                        ? "var(--enroll-brand)"
                        : "var(--enroll-text-secondary)",
                    }}
                  />
                </div>
                {isSelected && (
                  <CheckCircle2
                    className="h-5 w-5"
                    style={{ color: "var(--enroll-brand)" }}
                  />
                )}
              </div>

              <h3
                className="mt-3 text-sm font-semibold capitalize"
                style={{
                  color: isSelected
                    ? "var(--enroll-brand)"
                    : "var(--enroll-text-primary)",
                }}
              >
                {t(`${IV}styleTitle${level.charAt(0).toUpperCase() + level.slice(1)}`, level)}
              </h3>
              <p
                className="mt-1 text-xs leading-relaxed"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                {t(`${IV}styleDesc${level.charAt(0).toUpperCase() + level.slice(1)}`, "")}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold"
                  style={{
                    background:
                      "color-mix(in srgb, var(--color-success) 8%, var(--enroll-card-bg))",
                    color: "var(--color-success)",
                  }}
                >
                  Est. {meta.returnRange}
                </span>
                <span
                  className="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold"
                  style={{
                    background:
                      "color-mix(in srgb, var(--enroll-card-border) 30%, var(--enroll-card-bg))",
                    color: "var(--enroll-text-secondary)",
                  }}
                >
                  Risk: {meta.riskDisplay}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Allocation breakdown */}
      {allocation && (
        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: "var(--enroll-card-border)",
            background: "var(--enroll-card-bg)",
            boxShadow: "var(--enroll-elevation-1)",
          }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {/* Pie chart */}
            <div className="mx-auto h-32 w-32 shrink-0 sm:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {allocation.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend + risk */}
            <div className="flex-1 space-y-3">
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                {t(`${IV}portfolioBreakdown`, "Portfolio Breakdown")}
              </h3>
              <div className="space-y-2">
                {allocation.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--enroll-text-secondary)" }}
                      >
                        {entry.name}
                      </span>
                    </div>
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{ color: "var(--enroll-text-primary)" }}
                    >
                      {entry.value}%
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="flex items-center gap-1.5 rounded-lg px-3 py-2"
                style={{
                  background:
                    "color-mix(in srgb, var(--enroll-card-border) 20%, var(--enroll-card-bg))",
                }}
              >
                <Gauge
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--enroll-text-muted)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  Risk Level:{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--enroll-text-primary)" }}
                  >
                    {riskLevel
                      ? RISK_META[riskLevel].riskDisplay
                      : "Not set"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Fund details toggle */}
          <button
            type="button"
            onClick={() => setShowFunds(!showFunds)}
            className="mt-4 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            style={{
              color: "var(--enroll-brand)",
              background: showFunds
                ? "color-mix(in srgb, var(--enroll-brand) 6%, var(--enroll-card-bg))"
                : "transparent",
            }}
          >
            <span>
              {showFunds
                ? t(`${IV}hideFunds`, "Hide fund details")
                : t(`${IV}showFunds`, "View fund details")}
            </span>
            {showFunds ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showFunds && (
            <div className="mt-3 space-y-4">
              {allocation.map((cat) => (
                <div key={cat.name}>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <p
                      className="text-[0.68rem] font-semibold uppercase tracking-[0.04em]"
                      style={{ color: "var(--enroll-text-muted)" }}
                    >
                      {cat.name} — {cat.value}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    {cat.funds.map((fund) => (
                      <div
                        key={fund.ticker}
                        className="rounded-xl border px-3.5 py-3"
                        style={{
                          borderColor: "var(--enroll-card-border)",
                          background: "var(--enroll-card-bg)",
                        }}
                      >
                        <p
                          className="text-[0.82rem] font-medium"
                          style={{ color: "var(--enroll-text-primary)" }}
                        >
                          {fund.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span
                            className="text-[0.68rem]"
                            style={{ color: "var(--enroll-text-muted)" }}
                          >
                            {fund.ticker}
                          </span>
                          <span
                            style={{ color: "var(--enroll-card-border)" }}
                          >
                            ·
                          </span>
                          <span
                            className="text-[0.68rem]"
                            style={{ color: "var(--enroll-text-muted)" }}
                          >
                            ER {fund.expense}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI recommendation */}
      {riskLevel && (
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
            {t(
              `${IV}recommendationNote`,
              "We'll build a diversified portfolio matching your selected risk level. You can customize individual fund allocations after enrollment.",
            )}
          </p>
        </div>
      )}
    </div>
  );
}
