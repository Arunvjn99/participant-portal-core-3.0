import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Props = {
  userMonthly: number;
  employerMonthly: number;
  userPercent: number;
  employerPercent: number;
  isActive: boolean;
  className?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function MonthlyContribution({
  userMonthly,
  employerMonthly,
  userPercent,
  employerPercent,
  isActive,
  className,
}: Props) {
  const { t } = useTranslation();
  const total = userMonthly + employerMonthly;
  const now = new Date();
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(now);
  const year = now.getFullYear();

  const employeeBarWidth = Math.min(
    (userPercent / (userPercent + employerPercent || 1)) * 100,
    100,
  );
  const employerBarWidth = Math.min(
    (employerPercent / (userPercent + employerPercent || 1)) * 100,
    100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.06 }}
      className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">
            {t("dashboard.postEnrollment.monthlyContribution")}
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {month} {year}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.postEnrollment.peContribYou")} ({userPercent.toFixed(1)}%)
          </p>
          <p className="mt-1 text-lg font-bold text-foreground">{currency.format(userMonthly)}</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${employeeBarWidth}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.postEnrollment.peContribEmployer")} ({employerPercent.toFixed(1)}%)
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
            +{currency.format(employerMonthly)}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${employerBarWidth}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">{t("dashboard.postEnrollment.contribTotalPerMonth")}</p>
          <p className="mt-1 text-lg font-bold text-foreground">{currency.format(total)}</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-full rounded-full bg-primary/60" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        {isActive ? (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {t("dashboard.postEnrollment.active")}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
            {t("dashboard.postEnrollment.peContributionsInactive")}
          </span>
        )}
      </div>
    </motion.div>
  );
}
