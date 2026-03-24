import { motion } from "framer-motion";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { useRebalanceFlow } from "../contexts/RebalanceFlowContext";
import { useVersionedTxNavigate } from "../lib/nav";

export default function RebalanceCurrentAllocationPage() {
  const go = useVersionedTxNavigate();
  const { rebalanceData } = useRebalanceFlow();
  const funds = rebalanceData.funds;

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Current Allocation"
        description="Your invested mix before any changes. Review before adjusting your target allocation."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Portfolio Breakdown</FlowCardTitle>
        <div className="space-y-4">
          {funds.map((fund, i) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: fund.color, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{fund.name}</p>
                    <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)" }}>{fund.balance}</p>
                  </div>
                </div>
                <p style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>
                  {fund.currentAllocation}%
                </p>
              </div>
              <div style={{ height: 8, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fund.currentAllocation}%` }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                  style={{ height: "100%", background: fund.color, borderRadius: 99 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div
          style={{
            marginTop: 20,
            padding: "12px 16px",
            background: "var(--color-background-secondary)",
            borderRadius: 12,
            border: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>Total</p>
          <p className="text-lg font-extrabold tracking-tight" style={{ color: "var(--color-success)" }}>
            100%
          </p>
        </div>
      </FlowCard>

      <FlowNavButtons
        backLabel="Cancel"
        nextLabel="Adjust Target Allocation"
        onBack={() => go("transactions")}
        onNext={() => go("rebalance/adjust")}
      />
    </div>
  );
}
