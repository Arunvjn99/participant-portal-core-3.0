import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Props = {
  userName: string;
  balance: number;
  growthPercent: number;
  aiRecommendation: string;
  onIncreaseContribution: () => void;
  /** Hide AI strip when scenario turns insights off (demo). */
  showAiInsight?: boolean;
  /** Disable CTA when enrollment is not allowed for this scenario. */
  increaseContributionDisabled?: boolean;
  /**
   * Demo: replaces the default “Increase contribution” button with the scenario’s primary story CTA.
   */
  heroCta?: {
    labelKey: string;
    onClick: () => void;
    disabled?: boolean;
  };
  className?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

function greetingKey(hour: number): "morning" | "afternoon" | "evening" {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function PostEnrollmentDashboardHeader({
  userName,
  balance,
  growthPercent,
  aiRecommendation,
  onIncreaseContribution,
  showAiInsight = true,
  increaseContributionDisabled = false,
  heroCta,
  className,
}: Props) {
  const { t } = useTranslation();
  const hour = new Date().getHours();
  const part = greetingKey(hour);
  const greeting =
    part === "morning"
      ? t("dashboard.postEnrollment.peGreetMorning", { name: userName })
      : part === "afternoon"
        ? t("dashboard.postEnrollment.peGreetAfternoon", { name: userName })
        : t("dashboard.postEnrollment.peGreetEvening", { name: userName });

  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease, delay: 0.05 }}
          className="mb-4"
        >
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {greeting}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t("dashboard.postEnrollment.retirementProgress")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease, delay: 0.1 }}
          className="flex flex-wrap items-end gap-3 border-b border-border/60 pb-4"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("dashboard.postEnrollment.totalBalance")}
            </p>
            <p
              className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-foreground sm:text-4xl"
              aria-live="polite"
            >
              {formatUsd(balance)}
            </p>
          </div>
          <span className="mb-1 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t("dashboard.postEnrollment.growthPill", { pct: growthPercent })}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease, delay: 0.15 }}
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          {showAiInsight ? (
            <div className="flex min-w-0 items-start gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                aria-hidden
              >
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {t("dashboard.postEnrollment.peAiInsightLabel")}
                </p>
                <p className="text-sm font-medium leading-snug text-muted-foreground">
                  {aiRecommendation}
                </p>
              </div>
            </div>
          ) : (
            <div className="min-w-0 flex-1" />
          )}
          <motion.button
            type="button"
            onClick={
              heroCta
                ? heroCta.disabled
                  ? undefined
                  : heroCta.onClick
                : increaseContributionDisabled
                  ? undefined
                  : onIncreaseContribution
            }
            disabled={heroCta ? heroCta.disabled : increaseContributionDisabled}
            aria-disabled={heroCta ? heroCta.disabled : increaseContributionDisabled}
            whileHover={
              (heroCta ? heroCta.disabled : increaseContributionDisabled) ? undefined : { scale: 1.02 }
            }
            whileTap={
              (heroCta ? heroCta.disabled : increaseContributionDisabled) ? undefined : { scale: 0.98 }
            }
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              (heroCta ? heroCta.disabled : increaseContributionDisabled)
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : cn(
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                    heroCta && "ring-2 ring-primary/25 ring-offset-2 ring-offset-card",
                  ),
            )}
          >
            {heroCta ? t(heroCta.labelKey) : t("dashboard.postEnrollment.increaseContribution")}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
}
