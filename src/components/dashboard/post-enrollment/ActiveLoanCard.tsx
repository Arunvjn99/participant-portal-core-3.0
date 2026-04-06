import { motion } from "framer-motion";
import { Landmark, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LoanSlice } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";

type Props = {
  loan: LoanSlice;
  onRequestNew: () => void;
  requestNewDisabled?: boolean;
  className?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatDateShort(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

export function ActiveLoanCard({ loan, onRequestNew, requestNewDisabled = false, className }: Props) {
  const { t } = useTranslation();
  const paidPercent =
    loan.originalPrincipal > 0 ? Math.round((loan.paidPrincipal / loan.originalPrincipal) * 100) : 0;
  const remainingPayments =
    loan.nextPaymentAmount > 0 ? Math.max(1, Math.ceil(loan.remainingPrincipal / loan.nextPaymentAmount)) : 0;

  const paidOff = loan.remainingPrincipal <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.06 }}
      className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Landmark className="h-4 w-4 text-muted-foreground" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">{t("dashboard.postEnrollment.peActiveLoanTitle")}</h3>
        </div>
        <button
          type="button"
          onClick={requestNewDisabled ? undefined : onRequestNew}
          disabled={requestNewDisabled}
          aria-disabled={requestNewDisabled}
          className={cn(
            "flex items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-80",
            requestNewDisabled && "cursor-not-allowed opacity-50",
          )}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          {t("dashboard.postEnrollment.activeLoanRequestNew")}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-foreground">
          {loan.productName} #{loan.id.replace(/\D/g, "").slice(-4) || loan.id.slice(-4)}
        </p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            paidOff
              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
          )}
        >
          {t(loan.statusLabel)}
        </span>
      </div>
      {loan.originDate ? (
        <p className="mt-0.5 text-xs text-muted-foreground">
          {t("dashboard.postEnrollment.peLoanOriginated")} {formatDateShort(loan.originDate)}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">{t("dashboard.postEnrollment.peLoanRemaining")}</p>
          <p className="mt-0.5 text-lg font-semibold text-foreground">{fmt.format(loan.remainingPrincipal)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t("dashboard.postEnrollment.peLoanNextPayment")}</p>
          <p className="mt-0.5 text-lg font-semibold text-foreground">
            {fmt.format(loan.nextPaymentAmount)}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              · {formatDateShort(loan.nextPaymentDate)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${paidPercent}%` }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">
            {t("dashboard.postEnrollment.peLoanPaidPercent", { percent: paidPercent })}
          </span>
          <span className="text-muted-foreground">
            {t("dashboard.postEnrollment.activeLoanPaymentsLeft", { count: remainingPayments })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
