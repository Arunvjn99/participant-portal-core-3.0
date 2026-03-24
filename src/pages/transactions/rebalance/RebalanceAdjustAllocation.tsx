import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Info } from "lucide-react";
import { Slider } from "@/components/ui/Slider";
import { FlowPageHeader, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { cn } from "@/lib/utils";
import { useRebalanceFlow } from "../contexts/RebalanceFlowContext";
import { useVersionedTxNavigate } from "../lib/nav";

export default function RebalanceAdjustAllocationPage() {
  const go = useVersionedTxNavigate();
  const { rebalanceData, updateRebalanceData } = useRebalanceFlow();

  const [funds, setFunds] = useState(rebalanceData.funds.map((f) => ({ ...f })));

  const totalAllocation = funds.reduce((sum, f) => sum + f.targetAllocation, 0);
  const isValid = totalAllocation === 100;
  const hasChanges = funds.some((f) => f.targetAllocation !== f.currentAllocation);

  const handleSliderChange = (index: number, value: number) => {
    const updated = [...funds];
    updated[index] = { ...updated[index], targetAllocation: value };
    setFunds(updated);
  };

  const handleReset = () => {
    setFunds(funds.map((f) => ({ ...f, targetAllocation: f.currentAllocation })));
  };

  const handleContinue = () => {
    updateRebalanceData({ funds });
    go("rebalance/trades");
  };

  return (
    <div className="space-y-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start justify-between">
          <FlowPageHeader
            title="Adjust Target Allocation"
            description="Use the sliders to set your desired target allocation. Total must equal 100%."
          />
          {hasChanges && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 cursor-pointer transition-all duration-200 flex-shrink-0 ml-4"
              style={{
                background: "var(--card-bg)",
                border: "1.5px solid var(--border)",
                borderRadius: 20,
                padding: "7px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-text-secondary)",
              }}
            >
              <RotateCcw style={{ width: 13, height: 13 }} />
              Reset
            </button>
          )}
        </div>
      </motion.div>

      {/* Total Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div
          className={cn(
            "rounded-2xl border px-6 py-5 text-center transition-all duration-300",
            isValid
              ? "border-emerald-200/90 bg-gradient-to-br from-emerald-50 to-green-50/95 dark:border-emerald-600/35 dark:from-emerald-950/40 dark:to-green-950/30"
              : "border-amber-200/90 bg-gradient-to-br from-amber-50 to-amber-100/90 dark:border-amber-500/30 dark:from-amber-950/45 dark:to-amber-950/25",
          )}
        >
          <p className="mb-1 text-xs text-[var(--color-text-secondary)]">Total Allocation</p>
          <p
            className={cn(
              "text-4xl font-extrabold tracking-tight",
              isValid ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300",
            )}
          >
            {totalAllocation}%
          </p>
          {!isValid && (
            <p className="mt-1 text-xs font-semibold text-amber-800 dark:text-amber-200">
              {totalAllocation > 100
                ? `Reduce by ${totalAllocation - 100}%`
                : `Add ${100 - totalAllocation}% more`}
            </p>
          )}
        </div>
      </motion.div>

      {/* Fund Sliders */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", padding: "24px 28px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 24 }}>Investment Funds</h3>

          <div className="space-y-7">
            {funds.map((fund, index) => {
              const change = fund.targetAllocation - fund.currentAllocation;
              return (
                <motion.div
                  key={fund.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                    <div className="flex items-center gap-3">
                      <div
                        style={{ width: 12, height: 12, borderRadius: "50%", background: fund.color, flexShrink: 0 }}
                      />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{fund.name}</p>
                        <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                          Current: {fund.currentAllocation}% · {fund.balance}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>
                        {fund.targetAllocation}%
                      </span>
                      {change !== 0 && (
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: change > 0 ? "var(--color-success)" : "var(--color-danger)",
                            marginTop: 2,
                          }}
                        >
                          {change > 0 ? "+" : ""}
                          {change}%
                        </p>
                      )}
                    </div>
                  </div>

                  <Slider
                    value={[fund.targetAllocation]}
                    onValueChange={(v) => handleSliderChange(index, v[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="mb-2"
                  />

                  <div style={{ height: 6, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 99,
                        transition: "width 0.3s",
                        width: `${fund.targetAllocation}%`,
                        background: fund.color,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {!hasChanges && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 14,
            background: "color-mix(in srgb, var(--color-primary) 14%, var(--background))",
            border: "1px solid color-mix(in srgb, var(--color-primary) 35%, var(--border))",
          }}
        >
          <div className="flex items-center gap-2">
            <Info style={{ width: 16, height: 16, color: "var(--color-primary)", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "var(--color-primary)", fontWeight: 500 }}>
              Adjust the sliders above to set your new target allocation.
            </p>
          </div>
        </div>
      )}

      <FlowNavButtons
        backLabel="Back"
        nextLabel="Preview Trades"
        onBack={() => go("rebalance")}
        onNext={handleContinue}
        disabled={!isValid || !hasChanges}
      />
    </div>
  );
}
