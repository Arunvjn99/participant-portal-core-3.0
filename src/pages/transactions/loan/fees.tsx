import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowInfoBanner } from "@/components/transactions/FigmaFlowUI";
import { AiCoreBridgeButton } from "@/components/ai/AiCoreBridgeButton";
import { useLoanFlow } from "../contexts/LoanFlowContext";
import { useVersionedTxNavigate } from "../lib/nav";

export default function LoanFeesPage() {
  const { t } = useTranslation();
  const go = useVersionedTxNavigate();
  const { loanData } = useLoanFlow();
  const loanAmount = loanData.amount || 5000;

  const fees = [
    { label: "Transaction Fee", desc: "One-time processing fee", amount: 50 },
    { label: "TPA Fee", desc: "Third-party administrator fee", amount: 25 },
    { label: "EFT Fee", desc: "Electronic funds transfer fee", amount: 10 },
    { label: "Redemption Fee", desc: "Investment liquidation fee", amount: 15 },
  ];
  const totalFees = fees.reduce((s, f) => s + f.amount, 0);
  const netAmount = loanAmount - totalFees;

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Fees and Charges"
        description="Review all fees associated with your loan request. Fees are deducted from the gross loan amount."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Fee Breakdown</FlowCardTitle>
        <div className="space-y-0">
          <div className="flex items-center justify-between" style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>Gross Loan Amount</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>Total amount requested</p>
            </div>
            <p style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>
              ${loanAmount.toLocaleString()}
            </p>
          </div>

          {fees.map((fee) => (
            <div key={fee.label} className="flex items-center justify-between" style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{fee.label}</p>
                <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)" }}>{fee.desc}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>-${fee.amount}</p>
            </div>
          ))}

          <div className="flex items-center justify-between" style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>Total Fees</p>
            <p className="text-sm font-bold" style={{ color: "var(--color-danger)" }}>
              -${totalFees}
            </p>
          </div>

          <div className="flex items-center justify-between" style={{ padding: "16px 0" }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>Net Loan Amount</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>Amount you will receive</p>
            </div>
            <p className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-success)" }}>
              ${netAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </FlowCard>

      <FlowCard delay={0.08}>
        <FlowCardTitle>{t("aiSystem.aiInsight")}</FlowCardTitle>
        <p className="text-sm text-[var(--color-text-secondary)]">{t("aiSystem.feesAiBody")}</p>
        <AiCoreBridgeButton
          className="mt-3"
          prompt={`I'm reviewing 401(k) loan fees for a gross loan of $${loanAmount}. Help me understand each fee line and what to confirm with my plan.`}
        />
      </FlowCard>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
        <FlowInfoBanner variant="warning">
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="mb-1 text-[13px] font-bold">Important Disclosure</p>
              <p className="text-xs font-medium leading-5">
                Missed payments may trigger default and a taxable distribution. Payroll deduction is required while employed.
              </p>
            </div>
          </div>
        </FlowInfoBanner>
      </motion.div>

      <FlowNavButtons
        backLabel="Back to Configuration"
        nextLabel="Continue to Documents"
        onBack={() => go("loan/configuration")}
        onNext={() => go("loan/documents")}
      />
    </div>
  );
}
