import { motion } from "framer-motion";
import { DollarSign, Percent, Shield, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowInfoBanner } from "@/components/transactions/FigmaFlowUI";
import { cn } from "@/lib/utils";
import { useVersionedTxNavigate } from "../lib/nav";

const METRICS = [
  { label: "Available to withdraw", value: "$5,000", bg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))", color: "var(--color-primary)", Icon: DollarSign },
  { label: "Est. tax withholding", value: "20–35%", bg: "var(--ds-warning-light)", color: "var(--color-warning)", Icon: Percent },
  {
    label: "Vested balance",
    value: "$25,000",
    bg: "color-mix(in srgb, var(--color-primary) 12%, var(--muted))",
    color: "var(--color-primary)",
    Icon: Shield,
  },
];

const CHECKS = [
  { label: "Hardship withdrawal", eligible: true, note: "Available with documentation" },
  { label: "In-service withdrawal", eligible: false, note: "Requires age 59½ (current: 42)" },
  { label: "Required minimum distribution", eligible: false, note: "Requires age 73" },
  { label: "Termination withdrawal", eligible: false, note: "Active employment detected" },
];

export default function WithdrawEligibilityPage() {
  const go = useVersionedTxNavigate();

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Withdrawal Eligibility"
        description="Review your eligibility and understand the tax implications before continuing."
      />

      {/* Metrics */}
      <FlowCard delay={0.05}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {METRICS.map(({ label, value, bg, color, Icon }) => (
            <div key={label} style={{ background: bg, borderRadius: 12, padding: "16px 18px" }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon style={{ width: 14, height: 14, color: "var(--btn-primary-text)" }} />
                </div>
                <p style={{ fontSize: 11, fontWeight: 600, color }}>{label}</p>
              </div>
              <p style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>{value}</p>
            </div>
          ))}
        </div>
      </FlowCard>

      {/* Eligibility Checks */}
      <FlowCard delay={0.1}>
        <FlowCardTitle>Eligibility Check</FlowCardTitle>
        <div className="space-y-3">
          {CHECKS.map(({ label, eligible, note }) => (
            <div
              key={label}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3",
                eligible
                  ? "border-emerald-500/25 bg-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-500/15"
                  : "border-border bg-[var(--color-background-secondary)]",
              )}
            >
              {eligible ? (
                <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-[var(--color-text-tertiary)]" />
              )}
              <div>
                <p
                  className={cn(
                    "text-[13px] font-bold",
                    eligible ? "text-emerald-900 dark:text-emerald-100" : "text-[var(--color-text-secondary)]",
                  )}
                >
                  {label}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xs font-medium",
                    eligible ? "text-emerald-800/90 dark:text-emerald-200/90" : "text-[var(--color-text-tertiary)]",
                  )}
                >
                  {note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FlowCard>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}>
        <FlowInfoBanner variant="warning">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs font-medium leading-5">
              Early withdrawals before age 59½ may be subject to a 10% penalty in addition to ordinary income taxes.
            </p>
          </div>
        </FlowInfoBanner>
      </motion.div>

      <FlowNavButtons
        backLabel="Cancel"
        nextLabel="Select Withdrawal Type"
        onBack={() => go("transactions")}
        onNext={() => go("withdraw/type")}
      />
    </div>
  );
}
