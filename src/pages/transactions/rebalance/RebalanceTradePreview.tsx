import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowInfoBanner } from "@/components/transactions/FigmaFlowUI";
import { cn } from "@/lib/utils";
import { useRebalanceFlow } from "../contexts/RebalanceFlowContext";
import { useVersionedTxNavigate } from "../lib/nav";

export default function RebalanceTradePreviewPage() {
  const go = useVersionedTxNavigate();
  const { rebalanceData } = useRebalanceFlow();

  const trades = rebalanceData.funds
    .map((f) => ({ ...f, change: f.targetAllocation - f.currentAllocation }))
    .filter((f) => f.change !== 0);

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Trade Preview"
        description="Illustrative buys and sells to reach your target mix. Dollar amounts are estimates."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Estimated Trades</FlowCardTitle>
        {trades.length === 0 ? (
          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-tertiary)", textAlign: "center", padding: "24px 0" }}>
            No changes to your allocation.
          </p>
        ) : (
          <div className="space-y-3">
            {trades.map((trade, i) => {
              const isBuy = trade.change > 0;
              return (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3.5",
                    isBuy
                      ? "border-emerald-500/25 bg-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-500/15"
                      : "border-red-500/25 bg-red-500/10 dark:border-red-500/35 dark:bg-red-500/15",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: isBuy ? "var(--color-success)" : "var(--color-danger)" }}
                    >
                      {isBuy ? (
                        <TrendingUp style={{ width: 16, height: 16, color: "var(--btn-primary-text)" }} />
                      ) : (
                        <TrendingDown style={{ width: 16, height: 16, color: "var(--btn-primary-text)" }} />
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                        {isBuy ? "Buy" : "Sell"} — {trade.name}
                      </p>
                      <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)" }}>
                        {trade.currentAllocation}% → {trade.targetAllocation}%
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-[15px] font-extrabold tracking-tight"
                    style={{ color: isBuy ? "var(--color-success)" : "var(--color-danger)" }}
                  >
                    {isBuy ? "+" : ""}{trade.change}%
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "var(--color-background-secondary)",
            borderRadius: 12,
            border: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)" }}>Total trades</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{trades.length} orders</p>
        </div>
      </FlowCard>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
        <FlowInfoBanner variant="info">
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-primary)", lineHeight: "20px" }}>
            Trades are executed at market close on the next business day. No fees apply for in-plan rebalancing.
          </p>
        </FlowInfoBanner>
      </motion.div>

      <FlowNavButtons
        backLabel="Back to Adjust"
        nextLabel="Continue to Review"
        onBack={() => go("rebalance/adjust")}
        onNext={() => go("rebalance/review")}
      />
    </div>
  );
}
