import { motion } from "framer-motion";
import { ArrowLeftRight, Banknote, CheckCircle, Gift, RefreshCw, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ActivityEntry } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";

type Props = {
  items: ActivityEntry[];
  className?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

const iconMap: Record<ActivityEntry["type"], LucideIcon> = {
  contribution: CheckCircle,
  dividend: Gift,
  loan_payment: Banknote,
  transfer: ArrowLeftRight,
  rebalance: RefreshCw,
};

const iconColorMap: Record<ActivityEntry["type"], string> = {
  contribution: "text-emerald-500 bg-emerald-500/10",
  dividend: "text-amber-500 bg-amber-500/10",
  loan_payment: "text-amber-500 bg-amber-500/10",
  rebalance: "text-primary bg-primary/10",
  transfer: "text-primary bg-primary/10",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatDateShort(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function RecentActivity({ items, className }: Props) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.12 }}
      className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{t("dashboard.postEnrollment.recentTransactions")}</h3>
        <button type="button" className="text-xs font-medium text-primary hover:underline">
          {t("dashboard.postEnrollment.recentActivityViewAll")}
        </button>
      </div>

      <ul className="mt-4">
        {items.map((item, i) => {
          const Icon = iconMap[item.type];
          const isPositive = item.amount !== null && (item.amountIsPositive ?? item.amount >= 0);
          const isLast = i === items.length - 1;

          return (
            <li
              key={item.id}
              className={cn("flex items-center gap-3 py-3", !isLast && "border-b border-border")}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  iconColorMap[item.type],
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{formatDateShort(item.date)}</p>
              </div>

              <div className="shrink-0 text-right">
                {item.amount !== null ? (
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {currency.format(item.amount)}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">—</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
