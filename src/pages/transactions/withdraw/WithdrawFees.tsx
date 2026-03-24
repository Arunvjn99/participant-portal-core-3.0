import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowInfoBanner } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

const FEES = [
  { label: "Federal withholding (20%)", value: "$500", color: "var(--color-danger)" },
  { label: "State withholding (5%)", value: "$125", color: "var(--color-warning)" },
  { label: "Processing fee", value: "$25", color: "var(--color-text-secondary)" },
];

export default function WithdrawFeesPage() {
  const go = useVersionedTxNavigate();

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Fees & Withholding"
        description="Review estimated taxes, penalties, and plan fees before choosing delivery."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Withholding Estimate</FlowCardTitle>
        <div className="space-y-0">
          <div className="flex items-center justify-between" style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>Gross Withdrawal Amount</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>$2,500</p>
          </div>
          {FEES.map((fee) => (
            <div key={fee.label} className="flex items-center justify-between" style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{fee.label}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: fee.color }}>-{fee.value}</p>
            </div>
          ))}
          <div className="flex items-center justify-between" style={{ padding: "16px 0" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>Estimated Net Amount</p>
            <p className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-success)" }}>
              $1,850
            </p>
          </div>
        </div>
      </FlowCard>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
        <FlowInfoBanner variant="info">
          <div className="flex items-start gap-2.5">
            <Info className="flex-shrink-0 mt-0.5" style={{ width: 16, height: 16, color: "var(--color-primary)" }} />
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-primary)", lineHeight: "20px" }}>
              Final amounts depend on your elections and IRS rules in effect at distribution. Consult a tax advisor for personalized guidance.
            </p>
          </div>
        </FlowInfoBanner>
      </motion.div>

      <FlowNavButtons
        backLabel="Back to Source"
        nextLabel="Continue to Payment"
        onBack={() => go("withdraw/source")}
        onNext={() => go("withdraw/payment")}
      />
    </div>
  );
}
