import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckSquare,
  ChevronRight,
  Shield,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { NextBestAction, NextBestActionIcon } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";

type Props = {
  actions: NextBestAction[];
  onAction: (route: string) => void;
  className?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

const iconMap: Record<NextBestActionIcon, LucideIcon> = {
  Shield,
  Target,
  TrendingUp,
  Users,
  AlertTriangle,
};

function iconFor(action: NextBestAction): NextBestActionIcon {
  if (action.icon) return action.icon;
  return action.priority === "required" ? "AlertTriangle" : "Target";
}

const priorityStyles: Record<
  NextBestAction["priority"],
  { className: string; labelKey: string }
> = {
  required: {
    className: "bg-red-500/15 text-red-600 dark:text-red-400",
    labelKey: "dashboard.postEnrollment.peNbaPriorityRequired",
  },
  recommended: {
    className: "bg-primary/15 text-primary",
    labelKey: "dashboard.postEnrollment.peNbaPriorityRecommended",
  },
  optional: {
    className: "bg-muted text-muted-foreground",
    labelKey: "dashboard.postEnrollment.peNbaPriorityOptional",
  },
};

export function NextBestActions({ actions, onAction, className }: Props) {
  const { t } = useTranslation();

  if (!actions.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.08 }}
      className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}
    >
      <div className="mb-4 flex items-center gap-2">
        <CheckSquare className="h-4 w-4 text-muted-foreground" aria-hidden />
        <h3 className="text-sm font-semibold text-foreground">
          {t("dashboard.postEnrollment.nextBestActionsTitle")}
        </h3>
      </div>

      <ul className="divide-y divide-border">
        {actions.map((action, idx) => {
          const Icon = iconMap[iconFor(action)];
          const priority = priorityStyles[action.priority];
          return (
            <motion.li
              key={action.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.06 }}
            >
              <button
                type="button"
                onClick={() => onAction(action.route)}
                className="flex w-full items-center gap-3 rounded-lg py-3.5 text-left transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{t(action.title)}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{t(action.description)}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      priority.className,
                    )}
                  >
                    {t(priority.labelKey)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                </div>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
