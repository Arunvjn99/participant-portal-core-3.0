import { motion } from "framer-motion";
import { TrendingUp, Calendar, Shield } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowInfoBanner } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

const IMPACT_ITEMS = [
  { label: "Amount Moving", value: "$4,200", Icon: TrendingUp, bg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))", color: "var(--color-primary)" },
  {
    label: "Estimated Trade Date",
    value: "Next market close",
    Icon: Calendar,
    bg: "color-mix(in srgb, var(--color-success) 16%, var(--background))",
    color: "var(--color-success)",
  },
  {
    label: "Tax Impact",
    value: "None (in-plan)",
    Icon: Shield,
    bg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))",
    color: "var(--color-primary)",
  },
];

export default function TransferImpactPage() {
  const go = useVersionedTxNavigate();

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Impact Preview"
        description="Review how this transfer will affect your portfolio before confirming."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Transfer Details</FlowCardTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {IMPACT_ITEMS.map(({ label, value, Icon, bg, color }) => (
            <div key={label} style={{ background: bg, borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Icon style={{ width: 16, height: 16, color: "var(--btn-primary-text)" }} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, color, marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>{value}</p>
            </div>
          ))}
        </div>
      </FlowCard>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
        <FlowCard delay={0.1}>
          <FlowCardTitle>Portfolio Allocation After Transfer</FlowCardTitle>
          <div className="space-y-3">
            {[
              { label: "Stable Value Fund", before: 18, after: 12, color: "var(--color-success)" },
              { label: "Target Date 2045", before: 55, after: 61, color: "var(--color-primary)" },
              { label: "Large Cap Index", before: 27, after: 27, color: "var(--color-warning)" },
            ].map((fund) => (
              <div key={fund.label}>
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: fund.color }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{fund.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-tertiary)" }}>{fund.before}%</span>
                    <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>→</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color:
                          fund.after > fund.before
                            ? "var(--color-success)"
                            : fund.after < fund.before
                              ? "var(--color-danger)"
                              : "var(--foreground)",
                      }}
                    >
                      {fund.after}%
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${fund.after}%`, background: fund.color, borderRadius: 99, transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
          </div>
        </FlowCard>
      </motion.div>

      <FlowNavButtons
        backLabel="Back to Destination"
        nextLabel="Continue to Review"
        onBack={() => go("transfer/destination")}
        onNext={() => go("transfer/review")}
      />
    </div>
  );
}
