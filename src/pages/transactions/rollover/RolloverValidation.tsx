import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowInfoBanner } from "@/components/transactions/FigmaFlowUI";
import { cn } from "@/lib/utils";
import { useVersionedTxNavigate } from "../lib/nav";

const CHECKS = [
  { ok: true, title: "Account verified", note: "Recordkeeper matched employer and last four of account." },
  { ok: true, title: "Rollover eligible", note: "Prior plan allows outgoing rollover to qualified plan." },
  { ok: false, title: "Spousal consent", note: "Required if balance over $5,000 and you are married — upload on documents step." },
];

export default function RolloverValidationPage() {
  const go = useVersionedTxNavigate();
  const hasIssues = CHECKS.some((c) => !c.ok);

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Account Validation"
        description="We're verifying your previous plan details before proceeding."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Validation Results</FlowCardTitle>
        <div className="space-y-3">
          {CHECKS.map((check, i) => (
            <motion.div
              key={check.title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3.5",
                check.ok
                  ? "border-emerald-500/25 bg-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-500/15"
                  : "border-amber-200/90 bg-gradient-to-br from-amber-50 to-amber-100/80 dark:border-amber-500/30 dark:from-amber-950/45 dark:to-amber-950/25",
              )}
            >
              {check.ok ? (
                <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-amber-600 dark:text-amber-400" />
              )}
              <div>
                <p
                  className={cn(
                    "text-[13px] font-bold",
                    check.ok ? "text-emerald-900 dark:text-emerald-100" : "text-amber-900 dark:text-amber-100",
                  )}
                >
                  {check.title}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xs font-medium",
                    check.ok ? "text-emerald-800/90 dark:text-emerald-200/90" : "text-amber-800/90 dark:text-amber-200/90",
                  )}
                >
                  {check.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </FlowCard>

      {hasIssues && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <FlowInfoBanner variant="warning">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-xs font-medium leading-5">
                Some items require your attention. You can still proceed and resolve these on the documents step.
              </p>
            </div>
          </FlowInfoBanner>
        </motion.div>
      )}

      <FlowNavButtons
        backLabel="Back to Plan Details"
        nextLabel="Continue to Documents"
        onBack={() => go("rollover")}
        onNext={() => go("rollover/documents")}
      />
    </div>
  );
}
