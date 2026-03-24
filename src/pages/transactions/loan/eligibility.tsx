import { motion } from "framer-motion";
import { DollarSign, Percent, Calendar, TrendingDown, Wallet, AlertCircle } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle } from "@/components/transactions/FigmaFlowUI";
import { cn } from "@/lib/utils";
import { TransactionFooter } from "@/components/transactions/TransactionFooter";
import { useVersionedTxNavigate } from "../lib/nav";

const eligibilityData = [
  { icon: <DollarSign className="w-5 h-5" />, label: "Maximum Loan Available", value: "$10,000", bg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))", color: "var(--color-primary)" },
  {
    icon: <Wallet className="w-5 h-5" />,
    label: "Outstanding Loan Balance",
    value: "$0",
    bg: "color-mix(in srgb, var(--color-success) 16%, var(--background))",
    color: "var(--color-success)",
  },
  { icon: <DollarSign className="w-5 h-5" />, label: "Available Loan Balance", value: "$10,000", bg: "color-mix(in srgb, var(--color-primary) 10%, var(--muted))", color: "var(--color-primary)" },
  {
    icon: <Percent className="w-5 h-5" />,
    label: "Interest Rate",
    value: "8%",
    bg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))",
    color: "var(--color-primary)",
  },
  { icon: <Calendar className="w-5 h-5" />, label: "Maximum Term", value: "5 years", bg: "color-mix(in srgb, var(--color-primary) 6%, var(--muted))", color: "var(--color-primary)" },
  {
    icon: <TrendingDown className="w-5 h-5" />,
    label: "Estimated Monthly Payment Range",
    value: "$96 - $203",
    bg: "var(--ds-warning-light)",
    color: "var(--color-warning)",
  },
];

const RESTRICTIONS = [
  "You can have a maximum of 2 active loans at any time",
  "Loan repayment will be automatically deducted from your paycheck",
  "Early repayment is allowed without penalties",
  "Maximum loan amount is the lesser of 50% of vested balance or $50,000",
  "Spousal consent may be required depending on plan rules",
];

export default function LoanEligibilityPage() {
  const go = useVersionedTxNavigate();

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Loan Eligibility"
        description="Review your loan eligibility details before proceeding with a loan request."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Your Loan Details</FlowCardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {eligibilityData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.04, duration: 0.3 }}
              className="flex items-start gap-4"
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 40, height: 40, borderRadius: 10, background: item.bg, color: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </FlowCard>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div
          className={cn(
            "rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-orange-50/95 p-5 md:p-6",
            "dark:border-amber-500/30 dark:from-amber-950/45 dark:to-orange-950/35",
          )}
        >
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.3px", marginBottom: 12 }}>
            Plan Restrictions
          </h4>
          <ul className="space-y-2.5">
            {RESTRICTIONS.map((text, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500 dark:bg-amber-400" />
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", lineHeight: "20px" }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      >
        <div
          className="flex items-start gap-3"
          style={{
            background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, var(--background)) 0%, color-mix(in srgb, var(--color-primary) 10%, var(--muted)) 100%)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 35%, var(--border))",
            borderRadius: 14,
            padding: "16px 20px",
          }}
        >
          <AlertCircle className="flex-shrink-0 mt-0.5" style={{ width: 16, height: 16, color: "var(--color-primary)" }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)", marginBottom: 4 }}>Documentation Requirements</p>
            <p className="leading-relaxed" style={{ fontSize: 12, fontWeight: 500, color: "var(--color-primary)" }}>
              You will need to provide a voided check or bank statement for EFT disbursement, sign a promissory note, and may
              need spousal consent or employment verification depending on your plan and loan type.
            </p>
          </div>
        </div>
      </motion.div>

      <TransactionFooter backLabel="Cancel" nextLabel="Simulate loan" onBack={() => go("")} onNext={() => go("loan/simulator")} />
    </div>
  );
}
