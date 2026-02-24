import { useState } from "react";
import { useTranslation } from "react-i18next";
import { calculateVolatilityReduction, calculateOpportunityCost } from "../utils/calculations";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import { useLocaleFormat } from "../hooks/useLocaleFormat";
import type { HubFinancialData } from "../data/mockHubData";

interface RebalanceEngineProps {
  data: HubFinancialData;
}

const ALLOC_KEYS = ["stocks", "bonds", "cash", "other"] as const;

const ALLOC_COLORS: Record<string, string> = {
  stocks: "var(--chart-1, var(--color-primary))",
  bonds: "var(--chart-2, var(--color-success))",
  cash: "var(--chart-3, var(--color-warning, #ca8a04))",
  other: "var(--chart-4, var(--color-text-tertiary))",
};

export function RebalanceEngine({ data }: RebalanceEngineProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();
  const [showConfirm, setShowConfirm] = useState(false);
  const [applied, setApplied] = useState(false);

  const volReduction = calculateVolatilityReduction(data.portfolioDriftPercent);
  const projDelta =
    calculateOpportunityCost(
      data.projectedBalance * (data.portfolioDriftPercent / 100),
      data.avgReturnRate,
      data.yearsToRetirement,
    ) - data.projectedBalance * (data.portfolioDriftPercent / 100);

  const animDrift = useAnimatedNumber(applied ? 0 : data.portfolioDriftPercent);
  const animRisk = useAnimatedNumber(applied ? data.riskScore - 8 : data.riskScore);
  const animVol = useAnimatedNumber(volReduction);
  const animDelta = useAnimatedNumber(projDelta);

  const current = data.currentAllocation;
  const target = data.targetAllocation;

  return (
    <div
      role="tabpanel"
      id="tabpanel-rebalance"
      aria-labelledby="tab-rebalance"
      className="grid gap-6 lg:grid-cols-2"
    >
      {/* Allocation Comparison */}
      <div className="flex flex-col gap-5 rounded-xl border border-[var(--color-border)] p-5" style={{ backgroundColor: "var(--color-surface)" }}>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          {t("transactionHub.rebalance.title")}
        </h3>

        <div className="flex flex-col gap-4">
          {ALLOC_KEYS.map((key) => {
            const cur = current[key];
            const tgt = target[key];
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--color-text)]">
                    {t(`transactionHub.rebalance.${key}`)}
                  </span>
                  <span className="tabular-nums text-[var(--color-text-secondary)]">
                    {cur}% → {tgt}%
                  </span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${applied ? tgt : cur}%`,
                      backgroundColor: ALLOC_COLORS[key],
                    }}
                  />
                  {!applied && (
                    <div
                      className="absolute inset-y-0 rounded-full border-2 border-dashed opacity-50"
                      style={{
                        left: `${Math.min(cur, tgt)}%`,
                        width: `${Math.abs(tgt - cur)}%`,
                        borderColor: ALLOC_COLORS[key],
                      }}
                      aria-hidden
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={applied}
          className="mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 disabled:opacity-50"
          style={{ backgroundColor: applied ? "var(--color-success)" : "var(--color-primary)" }}
        >
          {applied ? "✓ " : ""}{t("transactionHub.rebalance.applyRebalance")}
        </button>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-5 rounded-xl border border-[var(--color-border)] p-5" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label={t("transactionHub.rebalance.currentDrift")}
            value={fmt.percent(animDrift)}
            color={animDrift > 3 ? "var(--color-warning, #ca8a04)" : "var(--color-success)"}
          />
          <MetricCard
            label={t("transactionHub.rebalance.riskScore")}
            value={fmt.number(animRisk)}
            color="var(--color-text)"
          />
          <MetricCard
            label={t("transactionHub.rebalance.volatilityReduction")}
            value={`-${fmt.number(animVol, 1)}%`}
            color="var(--color-success)"
          />
          <MetricCard
            label={t("transactionHub.rebalance.projectionDelta")}
            value={`+${fmt.currency(animDelta, true)}`}
            color="var(--color-success)"
          />
        </div>

        {/* Risk Score Gauge */}
        <div className="flex flex-col items-center gap-2 rounded-xl p-5" style={{ backgroundColor: "var(--color-background-secondary, var(--color-background))" }}>
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
            {t("transactionHub.rebalance.riskScore")}
          </span>
          <div className="relative h-4 w-full max-w-xs overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${animRisk}%`,
                background: "linear-gradient(to right, var(--color-success), var(--color-warning, #ca8a04), var(--color-danger))",
              }}
            />
          </div>
          <span className="text-2xl font-bold tabular-nums text-[var(--color-text)]">
            {fmt.number(animRisk)}/100
          </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
          <div
            className="mx-4 w-full max-w-sm rounded-2xl border border-[var(--color-border)] p-6 shadow-xl"
            style={{ backgroundColor: "var(--color-surface)" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rebalance-confirm-title"
          >
            <h4 id="rebalance-confirm-title" className="text-lg font-semibold text-[var(--color-text)]">
              {t("transactionHub.rebalance.confirmTitle")}
            </h4>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {t("transactionHub.rebalance.confirmMessage")}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background-secondary)]"
              >
                {t("transactionHub.rebalance.cancel")}
              </button>
              <button
                type="button"
                onClick={() => { setApplied(true); setShowConfirm(false); }}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {t("transactionHub.rebalance.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-3">
      <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-xl font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}
