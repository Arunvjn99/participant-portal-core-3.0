import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostEnrollmentAlert } from "@/stores/postEnrollmentDashboardStore";

const ease = [0.25, 0.1, 0.25, 1] as const;

const iconMap = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
  error: AlertTriangle,
} as const;

const colorMap = {
  warning: {
    icon: "text-amber-500",
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  info: {
    icon: "text-blue-500",
    badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  success: {
    icon: "text-emerald-500",
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  error: {
    icon: "text-red-500",
    badge: "bg-red-500/15 text-red-600 dark:text-red-400",
    bar: "bg-red-500",
  },
} as const;

type Props = {
  alerts: PostEnrollmentAlert[];
  className?: string;
};

export function AlertBanner({ alerts, className }: Props) {
  if (!alerts.length) return null;

  const alert = alerts[0];
  const Icon = iconMap[alert.type];
  const colors = colorMap[alert.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease }}
      className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn("mt-0.5 shrink-0", colors.icon)}>
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{alert.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{alert.subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              colors.badge,
            )}
          >
            {alert.status}
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">{alert.action}</span>
        </div>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", colors.bar)}
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
        />
      </div>
    </motion.div>
  );
}
